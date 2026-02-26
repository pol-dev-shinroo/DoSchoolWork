import React from "react";
import { FileText, Trash2, Download, Loader2 } from "lucide-react";

interface PdfToWordWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  onClear: () => void;
  onConvert: () => void;
}

export default function PdfToWordWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  onClear,
  onConvert,
}: PdfToWordWorkspaceProps) {
  return (
    <div className="flex flex-col gap-8 items-center py-2">
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className="w-5 h-5 text-[#355872] flex-shrink-0" />
          <p className="font-black text-[#355872] truncate max-w-[240px]">
            {fileName}
          </p>
        </div>
        <button
          onClick={onClear}
          disabled={isProcessing}
          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-xl text-center">
        <p className="text-xs font-bold text-[#355872]/80">
          <span className="font-black text-[#355872]">Note:</span> This tool
          extracts text and paragraphs locally. Complex tables or images may not
          be preserved.
        </p>
      </div>

      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all shadow-2xl shadow-[#355872]/20 disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            {progressStatus || "Converting..."}
          </span>
        ) : (
          <>
            <Download className="w-7 h-7" /> Convert to Word
          </>
        )}
      </button>
    </div>
  );
}
