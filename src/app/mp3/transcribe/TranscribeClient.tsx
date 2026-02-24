"use client";

import React, { useState, useRef, useEffect } from "react";
import PageShell from "@/components/layouts/PageShell";
import Mp3Nav from "@/components/nav/Mp3Nav";
import { useLanguage } from "@/context/LanguageContext";
import {
  UploadCloud,
  FileAudio,
  Loader2,
  Download,
  Sparkles,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";

export default function TranscribeClient() {
  const { t, locale } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [resultText, setResultText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading_model" | "decoding" | "transcribing" | "done" | "error"
  >("idle");

  const worker = useRef<Worker | null>(null);

  useEffect(() => {
    if (!worker.current) {
      console.log("[Client] Initializing Worker...");
      worker.current = new Worker("/worker.js", { type: "module" });
    }

    const onMessage = (e: MessageEvent) => {
      // DEBUG LOG
      console.log("[Client] Message from Worker:", e.data);

      const { status: msgStatus, progress: loadProgress, text } = e.data;

      if (msgStatus === "initiate") {
        setStatus("loading_model");
        setProgressLabel("Initializing AI Brain...");
      } else if (msgStatus === "progress") {
        const pct = Math.round(loadProgress || 0);
        setProgressPercent(pct);
        setProgressLabel(`Downloading Model: ${pct}%`);
      } else if (msgStatus === "update") {
        setStatus("transcribing");
        setResultText(text);
        setProgressLabel("Transcribing...");
      } else if (msgStatus === "complete") {
        setResultText(text);
        setStatus("done");
        setIsProcessing(false);
        setProgressPercent(100);
      } else if (msgStatus === "error") {
        console.error("[Client] Received Error from Worker:", text);
        setStatus("error");
        setIsProcessing(false);
        alert(text);
      }
    };

    worker.current.addEventListener("message", onMessage);
    return () => worker.current?.removeEventListener("message", onMessage);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log(
        `[Client] File selected: ${selectedFile.name} (${selectedFile.size} bytes)`,
      );
      setFile(selectedFile);
      setResultText("");
      setStatus("idle");
      setProgressPercent(0);
    }
  };

  // --- AUDIO DECODING WITH LOGGING ---
  const decodeAudio = async (audioFile: File): Promise<Float32Array> => {
    console.log("[Client] Starting Audio Decoding...");
    const arrayBuffer = await audioFile.arrayBuffer();
    console.log(
      `[Client] File loaded into ArrayBuffer. Size: ${arrayBuffer.byteLength}`,
    );

    const audioContext = new AudioContext({ sampleRate: 16000 });
    console.log("[Client] AudioContext created. Decoding data...");

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log(
      `[Client] Audio Decoded. Channels: ${audioBuffer.numberOfChannels}, Duration: ${audioBuffer.duration}s`,
    );

    const audioData = audioBuffer.getChannelData(0);
    console.log(`[Client] Raw Float32Array ready. Length: ${audioData.length}`);
    return audioData;
  };

  const startTranscription = async () => {
    if (!file || !worker.current) return;
    setIsProcessing(true);

    try {
      setStatus("decoding");
      setProgressLabel("Decoding Audio...");

      const audioData = await decodeAudio(file);

      setStatus("transcribing");
      setProgressLabel("Sending to AI...");
      console.log("[Client] Posting message to Worker...");

      // Send to worker
      worker.current.postMessage({ audio: audioData });
      console.log("[Client] Message posted!");
    } catch (error) {
      console.error("[Client] Main Thread Error:", error);
      setIsProcessing(false);
      setStatus("error");
      alert("Failed to decode audio. Check console for details.");
    }
  };

  const resetTool = () => {
    setFile(null);
    setResultText("");
    setStatus("idle");
    setIsProcessing(false);
    setProgressPercent(0);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setTextColor(53, 88, 114);
    doc.text("Audio Transcript", margin, 30);
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
        <div
          className={`relative bg-white rounded-[2rem] border-2 transition-all p-12 flex flex-col items-center justify-center text-center shadow-sm ${isProcessing ? "border-[#355872]/20 opacity-50" : "border-[#355872]/10 hover:border-[#355872]/30"}`}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isProcessing}
          />
          {file ? (
            <>
              <div className="w-20 h-20 bg-[#355872]/5 rounded-full flex items-center justify-center mb-6">
                <FileAudio className="w-10 h-10 text-[#355872]" />
              </div>
              <h3 className="text-xl font-black text-[#355872] mb-1">
                {file.name}
              </h3>
              <p className="text-sm font-bold text-[#355872]/40">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-[#F7F8F0] rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-[#355872]/40" />
              </div>
              <h3 className="text-xl font-black text-[#355872] mb-2">
                {t.mp3ToPdf.workspaceTitle}
              </h3>
              <p className="text-sm font-bold text-[#355872]/50 max-w-sm">
                {t.mp3ToPdf.workspaceDesc}
              </p>
            </>
          )}
        </div>

        {isProcessing && (
          <div className="bg-white rounded-3xl p-8 border-2 border-[#355872]/10 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-[#355872] animate-spin" />
              <span className="text-sm font-black text-[#355872]">
                {progressLabel}
              </span>
            </div>
            <div className="h-4 w-full bg-[#F7F8F0] rounded-full overflow-hidden border border-[#355872]/5 relative">
              <div
                className="h-full bg-[#355872] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {resultText && (
          <div className="bg-white rounded-[2.5rem] border-2 border-[#355872]/10 p-10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#355872]">
                Transcript Ready
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={resetTool}
                  className="p-3 text-[#355872]/40 hover:text-[#355872] hover:bg-[#F7F8F0] rounded-xl"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Save PDF
                </button>
              </div>
            </div>
            <div className="p-6 bg-[#F7F8F0]/50 rounded-[1.5rem] border border-[#355872]/5 max-h-[400px] overflow-y-auto text-sm text-[#355872]/80 leading-relaxed font-medium">
              {resultText}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
