"use client";

import React, { useState, useRef, useEffect } from "react";
import PageShell from "@/components/layouts/PageShell";
import Mp3Nav from "@/components/nav/Mp3Nav";
import { useLanguage } from "@/context/LanguageContext";
import jsPDF from "jspdf";
import { Sparkles } from "lucide-react";

import TranscribeUploadZone from "@/components/ui/TranscribeUploadZone";
import TranscribeTerminal, {
  TerminalLog,
} from "@/components/ui/TranscribeTerminal";
import TranscribeResult from "@/components/ui/TranscribeResult";

export default function TranscribeClient() {
  const { t, locale } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState("");

  // Terminal State
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [liveText, setLiveText] = useState("");

  const worker = useRef<Worker | null>(null);

  // Helper to add or update terminal logs
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

  const completeLastLog = () => {
    setLogs((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1].status = "success";
      return updated;
    });
  };

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker("/worker.js", { type: "module" });
    }

    const onMessage = (e: MessageEvent) => {
      const { status: msgStatus, progress: loadProgress, text } = e.data;

      if (msgStatus === "initiate") {
        completeLastLog();
        appendLog("Downloading AI Engine (Whisper)...", "pending", 0);
      } else if (msgStatus === "progress") {
        appendLog(
          "Downloading AI Engine (Whisper)...",
          "pending",
          Math.round(loadProgress || 0),
        );
      } else if (msgStatus === "model_ready") {
        completeLastLog();
        appendLog("Analyzing and transcribing audio segments...", "pending");
      } else if (msgStatus === "update") {
        setLiveText(text); // Stream the actual words to the terminal
      } else if (msgStatus === "complete") {
        completeLastLog();
        setLiveText("");
        setResultText(text);
        setIsProcessing(false);
      } else if (msgStatus === "error") {
        appendLog(`Fatal Error: ${text}`, "error");
        setIsProcessing(false);
      }
    };

    worker.current.addEventListener("message", onMessage);
    return () => worker.current?.removeEventListener("message", onMessage);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultText("");
      setLogs([]);
      setLiveText("");
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
    setLogs([]); // Clear terminal on start
    setLiveText("");

    try {
      appendLog("Decoding local audio file (16kHz)...", "pending");
      const audioData = await decodeAudio(file);
      completeLastLog();

      appendLog("Waking up Local AI Engine...", "pending");
      worker.current.postMessage({ audio: audioData });
    } catch (error) {
      appendLog("Failed to read audio format.", "error");
      setIsProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setResultText("");
    setLogs([]);
    setLiveText("");
    setIsProcessing(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(22);
    doc.setTextColor(53, 88, 114);
    doc.text("Audio Transcript", margin, 30);
    doc.setFontSize(10);
    doc.setTextColor(122, 170, 206);
    doc.text(`File: ${file?.name}`, margin, 40);
    doc.setDrawColor(53, 88, 114, 0.1);
    doc.line(margin, 50, pageWidth - margin, 50);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const splitText = doc.splitTextToSize(resultText, pageWidth - margin * 2);
    doc.text(splitText, margin, 65);
    doc.save(`${file?.name.split(".")[0]}_transcript.pdf`);
  };

  return (
    <PageShell
      title={t.mp3ToPdf.title}
      description={t.mp3ToPdf.description}
      navToggle={<Mp3Nav />}
    >
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
        <TranscribeUploadZone
          file={file}
          isProcessing={isProcessing}
          onFileChange={onFileChange}
          t={t}
        />

        {file && !isProcessing && !resultText && (
          <button
            onClick={startTranscription}
            className="bg-[#355872] text-white w-full py-5 rounded-2xl font-black text-xl hover:bg-[#355872]/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-[#355872]/10 flex items-center justify-center gap-3 animate-in slide-in-from-top-4"
          >
            <Sparkles className="w-6 h-6" />
            {locale === "en" ? "Start Transcription" : "변환 시작"}
          </button>
        )}

        {isProcessing && <TranscribeTerminal logs={logs} liveText={liveText} />}

        {resultText && (
          <TranscribeResult
            resultText={resultText}
            onReset={resetTool}
            onDownload={downloadPDF}
            locale={locale}
          />
        )}
      </div>
    </PageShell>
  );
}
