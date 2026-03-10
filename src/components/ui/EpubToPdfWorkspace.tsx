import React from "react";
import { BookUp, Trash2, FileDown, Loader2 } from "lucide-react";

interface EpubToPdfWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  onClear: () => void;
  onConvert: () => Promise<void>;
}

export default function EpubToPdfWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  onClear,
  onConvert,
}: EpubToPdfWorkspaceProps) {
  return (
    <div className="flex flex-col gap-8 items-center py-2">
      {/* Header Bar */}
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <BookUp className="w-5 h-5 text-[#355872] flex-shrink-0" />
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

      {/* Privacy Disclaimer */}
      <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-xl text-center">
        <p className="text-xs font-bold text-[#355872]/80">
          <span className="font-black text-[#355872]">Note:</span> Book
          rendering and formatting run entirely on your device to protect your
          privacy.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] transition-all disabled:opacity-50 shadow-xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            {progressStatus || "Processing..."}
          </span>
        ) : (
          <>
            <FileDown className="w-7 h-7" /> Convert to PDF
          </>
        )}
      </button>
    </div>
  );
}
