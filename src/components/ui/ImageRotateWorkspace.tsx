import React from "react";
import { Image as ImageIcon, Trash2, RotateCw, Download } from "lucide-react";

interface ImageRotateWorkspaceProps {
  imageSrc: string;
  fileName: string;
  rotation: number;
  isProcessing: boolean;
  onRotate: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export default function ImageRotateWorkspace({
  imageSrc,
  fileName,
  rotation,
  isProcessing,
  onRotate,
  onClear,
  onDownload,
}: ImageRotateWorkspaceProps) {
  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Header Bar */}
      <div className="flex items-center gap-2 bg-[#F7F8F0] px-4 py-2 rounded-xl border border-[#355872]/10 w-full">
        <ImageIcon className="w-4 h-4 text-[#355872] flex-shrink-0" />
        <span className="font-bold text-[#355872] text-sm truncate flex-1">
          {fileName}
        </span>
        <button
          onClick={onClear}
          className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preview Window */}
      <div className="relative w-64 h-64 flex items-center justify-center bg-[#F7F8F0]/50 rounded-2xl border-2 border-[#355872]/5 overflow-hidden">
        <img
          src={imageSrc}
          alt="Preview"
          className="max-w-full max-h-full transition-transform duration-300 ease-in-out shadow-lg"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <button
          onClick={onRotate}
          className="flex-1 bg-white border-2 border-[#355872]/10 text-[#355872] px-6 py-4 rounded-2xl font-black hover:bg-[#F7F8F0] hover:border-[#355872]/30 transition-all flex items-center justify-center gap-2"
        >
          <RotateCw className="w-5 h-5" /> Rotate 90°
        </button>

        <button
          onClick={onDownload}
          disabled={isProcessing}
          className="flex-[2] bg-[#355872] text-[#F7F8F0] px-6 py-4 rounded-2xl font-black hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#355872]/20 disabled:opacity-30 disabled:grayscale"
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : (
            <>
              <Download className="w-5 h-5" /> Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}
