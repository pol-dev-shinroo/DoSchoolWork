import React from "react";
import { FileText, Trash2, Download, Loader2 } from "lucide-react";

interface WordToPdfWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onClear: () => void;
  onConvert: () => void;
}

export default function WordToPdfWorkspace({
  fileName,
  isProcessing,
  contentRef,
  onClear,
  onConvert,
}: WordToPdfWorkspaceProps) {
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

      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all shadow-2xl shadow-[#355872]/20 disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Download className="w-7 h-7" /> Download PDF
          </>
        )}
      </button>

      {/* Hidden container for rendering HTML to PDF */}
      <div className="hidden">
        <div
          ref={contentRef}
          className="pdf-content-wrapper bg-white"
          style={{
            width: "794px", // Approx A4 width at 96 DPI
            minHeight: "1123px",
            padding: "40px",
            color: "black",
          }}
        />
      </div>
    </div>
  );
}
