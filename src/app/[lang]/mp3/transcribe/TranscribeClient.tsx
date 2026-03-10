"use client";

import React, { useState, useRef, useEffect } from "react";
import PageShell from "@/components/layouts/PageShell";
import Mp3Nav from "@/components/nav/Mp3Nav";
import { useLanguage } from "@/context/LanguageContext";
import jsPDF from "jspdf";
import { Sparkles, Download, RotateCcw } from "lucide-react";

import TranscribeUploadZone from "@/components/ui/TranscribeUploadZone";
import TranscribeTerminal, {
  TerminalLog,
} from "@/components/ui/TranscribeTerminal";

// ==========================================
// 1. INTERFACES & TYPES
// ==========================================

interface TranscriptionChunk {
  timestamp: [number, number | null];
  text: string;
}

export default function TranscribeClient() {
  const { t, locale } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscriptionDone, setIsTranscriptionDone] = useState(false);

  const [resultText, setResultText] = useState("");
  const [editableText, setEditableText] = useState("");

  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [liveText, setLiveText] = useState("");

  const [transcriptionProgress, setTranscriptionProgress] = useState<number>(0);

  const worker = useRef<Worker | null>(null);

  // ==========================================
  // 2. HELPER FUNCTIONS
  // ==========================================

  const appendLog = (
    message: string,
    status: TerminalLog["status"],
    progress?: number,
  ) => {
    setLogs((prev) => {
      if (progress !== undefined && prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.message === message && last.status === "pending") {
          const updated = [...prev];
          updated[updated.length - 1] = { ...last, progress };
          return updated;
        }
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          message,
          status,
          progress,
        },
      ];
    });
  };

  // FIX 1: Bulletproof log completion. This guarantees no spinners get permanently stuck!
  const completePendingLogs = () => {
    setLogs((prev) =>
      prev.map((log) =>
        log.status === "pending" ? { ...log, status: "success" } : log,
      ),
    );
  };

  const formatTime = (seconds: number) => {
    if (seconds === null || seconds === undefined) return "[00:00]";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `[${m}:${s}]`;
  };

  // ==========================================
  // 3. WORKER & AUDIO ENGINE
  // ==========================================

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker("/worker.js", { type: "module" });
    }

    const onMessage = (e: MessageEvent) => {
      const {
        status: msgStatus,
        progress: loadProgress,
        text,
        chunks,
      } = e.data;

      if (msgStatus === "initiate") {
        completePendingLogs();
        appendLog("Connecting to AI Engine...", "pending", 0);
      } else if (msgStatus === "info") {
        appendLog(text, "info");
      } else if (msgStatus === "progress") {
        appendLog(
          "Downloading AI Engine Model...",
          "pending",
          Math.round(loadProgress || 0),
        );
      } else if (msgStatus === "model_ready") {
        completePendingLogs(); // This clears out the "Connecting" bug!
        appendLog("Analyzing and transcribing audio segments...", "pending");

        // FIX 2: Set initial progress to 1% so the UI immediately shows the global progress bar!
        setTranscriptionProgress(1);
      } else if (msgStatus === "transcribe_progress") {
        // Ensure progress doesn't jump backwards or look empty
        setTranscriptionProgress(Math.max(1, loadProgress));
      } else if (msgStatus === "update") {
        setLiveText(text);
      } else if (msgStatus === "complete") {
        completePendingLogs();
        setLiveText("");
        setTranscriptionProgress(100);

        let formattedTranscript = text;
        if (chunks && chunks.length > 0) {
          formattedTranscript = chunks
            .map((chunk: TranscriptionChunk) => {
              const startTime = chunk.timestamp[0];
              return `${formatTime(startTime)} ${chunk.text.trim()}`;
            })
            .join("\n\n");
        }

        setResultText(formattedTranscript);
        setEditableText(formattedTranscript);
        setIsProcessing(false);
        setIsTranscriptionDone(true);
      } else if (msgStatus === "error") {
        completePendingLogs(); // Stop loading spinners on error
        appendLog(text, "error");
      }
    };

    worker.current.addEventListener("message", onMessage);
    return () => worker.current?.removeEventListener("message", onMessage);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultText("");
      setEditableText("");
      setIsTranscriptionDone(false);
      setLogs([]);
      setLiveText("");
      setTranscriptionProgress(0);
    }
  };

  const decodeAudio = async (audioFile: File): Promise<Float32Array> => {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new window.AudioContext({ sampleRate: 16000 });
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.getChannelData(0);
  };

  const startTranscription = async () => {
    if (!file || !worker.current) return;
    setIsProcessing(true);
    setIsTranscriptionDone(false);
    setLogs([]);
    setLiveText("");
    setTranscriptionProgress(0);

    try {
      appendLog("Decoding local audio file (16kHz)...", "pending");
      const audioData = await decodeAudio(file);
      completePendingLogs();

      appendLog("Waking up AI Engine...", "pending");
      worker.current.postMessage({ audio: audioData });
    } catch (error) {
      appendLog("Failed to read audio format.", "error");
    }
  };

  const resetTool = () => {
    setFile(null);
    setResultText("");
    setEditableText("");
    setIsTranscriptionDone(false);
    setLogs([]);
    setLiveText("");
    setTranscriptionProgress(0);
    setIsProcessing(false);
  };

  // ==========================================
  // 4. PDF GENERATOR
  // ==========================================

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 30;
    let pageTracker = 1;

    doc.setFontSize(22);
    doc.setTextColor(53, 88, 114);
    doc.text("Audio Transcript", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(122, 170, 206);
    doc.text(`File: ${file?.name}`, margin, y);
    y += 6;

    doc.setDrawColor(53, 88, 114, 0.1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const splitText = doc.splitTextToSize(editableText, pageWidth - margin * 2);
    const lineHeight = 6;

    for (let i = 0; i < splitText.length; i++) {
      if (y > pageHeight - margin - 10) {
        doc.addPage();
        pageTracker++;
        y = margin + 10;
      }
      doc.text(splitText[i], margin, y);
      y += lineHeight;
    }

    for (let i = 1; i <= pageTracker; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageTracker}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    }

    doc.save(`doSchoolWork_${file?.name.split(".")[0]}.pdf`);
  };

  return (
    <PageShell
      title={t.mp3ToPdf.title}
      description={t.mp3ToPdf.description}
      navToggle={<Mp3Nav />}
    >
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-8">
        {!isTranscriptionDone && (
          <TranscribeUploadZone
            file={file}
            isProcessing={isProcessing}
            onFileChange={onFileChange}
            t={t}
          />
        )}

        {file && !isProcessing && !isTranscriptionDone && (
          <button
            onClick={startTranscription}
            className="bg-[#355872] text-white w-full py-5 rounded-2xl font-black text-xl hover:bg-[#355872]/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-[#355872]/10 flex items-center justify-center gap-3 animate-in slide-in-from-top-4"
          >
            <Sparkles className="w-6 h-6" />
            {locale === "en" ? "Start Transcription" : "변환 시작"}
          </button>
        )}

        {isProcessing && (
          <TranscribeTerminal
            logs={logs}
            liveText={liveText}
            transcriptionProgress={transcriptionProgress}
          />
        )}

        {isTranscriptionDone && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-[#355872]/5 border-2 border-[#355872]/10">
              <h3 className="text-xl font-black text-[#355872] mb-1">
                {locale === "en" ? "Review & Edit" : "검토 및 편집"}
              </h3>
              <p className="text-sm text-gray-500 mb-4 font-medium">
                {locale === "en"
                  ? "Make any necessary corrections before downloading the final PDF."
                  : "최종 PDF를 다운로드하기 전에 필요한 부분을 수정하세요."}
              </p>

              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full h-80 p-5 rounded-2xl bg-gray-50/50 border-2 border-gray-100 text-gray-700 leading-relaxed focus:ring-4 focus:ring-[#355872]/10 focus:border-[#355872]/40 outline-none transition-all resize-y custom-scrollbar"
                placeholder="Transcript will appear here..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetTool}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[#355872] bg-[#355872]/5 hover:bg-[#355872]/10 active:scale-[0.99] transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                {locale === "en" ? "Start Over" : "다시 시작"}
              </button>
              <button
                onClick={downloadPDF}
                className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-[#355872] hover:bg-[#355872]/90 shadow-lg shadow-[#355872]/20 active:scale-[0.99] transition-all"
              >
                <Download className="w-5 h-5" />
                {locale === "en" ? "Export to PDF" : "PDF 다운로드"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
