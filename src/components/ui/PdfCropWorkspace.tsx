import React from "react";
import { Scissors, Download } from "lucide-react";

interface PdfCropWorkspaceProps {
  fileName: string;
  totalPages: number | null;
  pages: { start: number; end: number };
  isProcessing: boolean;
  isInvalid: boolean;
  onClear: () => void;
  onPageChange: (type: "start" | "end", value: number) => void;
  onProcess: () => void;
}

export default function PdfCropWorkspace({
  fileName,
  totalPages,
  pages,
  isProcessing,
  isInvalid,
  onClear,
  onPageChange,
  onProcess,
}: PdfCropWorkspaceProps) {
  return (
    <div className="flex flex-col gap-10 items-center py-2">
      <div className="text-center w-full">
        <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10">
          <Scissors className="w-5 h-5 text-[#355872]" />
          <p className="font-black text-[#355872] truncate max-w-[240px]">
            {fileName}
          </p>
          {totalPages && (
            <span className="text-[10px] font-black bg-[#355872] text-[#F7F8F0] px-2 py-1 rounded-lg">
              {totalPages} PG
            </span>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={onClear}
            className="text-xs font-black text-[#7AAACE] hover:text-[#355872] transition-colors uppercase tracking-[0.2em]"
          >
            Change Document
          </button>
        </div>
      </div>

      <div className="flex gap-8 items-center w-full justify-center">
        <div className="flex flex-col items-center">
          <label className="text-[11px] font-black text-[#7AAACE] mb-3 uppercase tracking-[0.3em]">
            Start
          </label>
          <input
            type="number"
            min="1"
            value={pages.start || ""}
            className={`border-4 bg-[#F7F8F0]/50 p-5 w-32 rounded-[2rem] text-center text-2xl font-black text-[#355872] outline-none transition-all ${
              pages.start < 1 || pages.start > (totalPages || 0)
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-transparent focus:border-[#9CD5FF] focus:bg-white focus:shadow-2xl focus:shadow-[#9CD5FF]/30"
            }`}
            onChange={(e) => onPageChange("start", Number(e.target.value))}
          />
        </div>

        <div className="h-1 w-8 bg-[#355872]/10 mt-10 rounded-full" />

        <div className="flex flex-col items-center">
          <label className="text-[11px] font-black text-[#7AAACE] mb-3 uppercase tracking-[0.3em]">
            End
          </label>
          <input
            type="number"
            min="1"
            value={pages.end || ""}
            className={`border-4 bg-[#F7F8F0]/50 p-5 w-32 rounded-[2rem] text-center text-2xl font-black text-[#355872] outline-none transition-all ${
              pages.end > (totalPages || 0) || pages.end < pages.start
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-transparent focus:border-[#9CD5FF] focus:bg-white focus:shadow-2xl focus:shadow-[#9CD5FF]/30"
            }`}
            onChange={(e) => onPageChange("end", Number(e.target.value))}
          />
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={isProcessing || isInvalid}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 border-4 border-[#F7F8F0]/30 border-t-[#F7F8F0] rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          <>
            <Download className="w-7 h-7" /> Export PDF
          </>
        )}
      </button>
    </div>
  );
}
