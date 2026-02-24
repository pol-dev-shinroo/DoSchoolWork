import React from "react";
import { Download, RefreshCw } from "lucide-react";

interface TranscribeResultProps {
  resultText: string;
  onReset: () => void;
  onDownload: () => void;
  locale: string;
}

export default function TranscribeResult({
  resultText,
  onReset,
  onDownload,
  locale,
}: TranscribeResultProps) {
  return (
    <div className="bg-white rounded-[2.5rem] border-2 border-[#355872]/10 p-10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-[#355872]">
          {locale === "en" ? "Transcript Ready" : "변환 완료"}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="p-3 text-[#355872]/40 hover:text-[#355872] hover:bg-[#F7F8F0] rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={onDownload}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />{" "}
            {locale === "en" ? "Save PDF" : "PDF 저장"}
          </button>
        </div>
      </div>
      <div className="p-6 bg-[#F7F8F0]/50 rounded-[1.5rem] border border-[#355872]/5 max-h-[400px] overflow-y-auto text-sm text-[#355872]/80 leading-relaxed font-medium whitespace-pre-wrap">
        {resultText}
      </div>
    </div>
  );
}
