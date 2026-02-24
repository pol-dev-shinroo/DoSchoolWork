import React from "react";
import { UploadCloud, FileAudio } from "lucide-react";

// 1. We tell TypeScript exactly what parts of the dictionary we expect to receive
interface TranscribeUploadZoneProps {
  file: File | null;
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: {
    mp3ToPdf: {
      workspaceTitle: string;
      workspaceDesc: string;
    };
  };
}

export default function TranscribeUploadZone({
  file,
  isProcessing,
  onFileChange,
  t,
}: TranscribeUploadZoneProps) {
  return (
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
  );
}
