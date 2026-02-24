import React from "react";
import { MoveUp, MoveDown, Trash2, Plus, Download } from "lucide-react";

interface FileItem {
  id: string;
  file: File;
}

interface PdfMergeWorkspaceProps {
  files: FileItem[];
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMoveFile: (index: number, direction: "up" | "down") => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
  onMerge: () => void;
}

export default function PdfMergeWorkspace({
  files,
  isProcessing,
  onFileChange,
  onMoveFile,
  onRemoveFile,
  onClearAll,
  onMerge,
}: PdfMergeWorkspaceProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-xl font-black text-[#355872]">Merge List</h2>
        <p className="text-[10px] text-[#7AAACE] font-black uppercase tracking-[0.3em] mt-2">
          {files.length} Documents
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {files.map((item, index) => {
          const isDuplicateName =
            files.filter((f) => f.file.name === item.file.name).length > 1;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-[#F7F8F0]/50 p-5 rounded-2xl border-2 border-[#355872]/5 group transition-all hover:bg-white hover:shadow-xl hover:shadow-[#355872]/5"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onMoveFile(index, "up")}
                  disabled={index === 0}
                  className="text-[#7AAACE]/40 hover:text-[#355872] disabled:opacity-0 transition-colors"
                >
                  <MoveUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onMoveFile(index, "down")}
                  disabled={index === files.length - 1}
                  className="text-[#7AAACE]/40 hover:text-[#355872] disabled:opacity-0 transition-colors"
                >
                  <MoveDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#355872] truncate text-sm">
                    {item.file.name}
                  </p>
                  {isDuplicateName && (
                    <span className="text-[8px] font-black bg-[#9CD5FF]/30 text-[#355872] px-2 py-0.5 rounded uppercase tracking-tighter">
                      Same Name
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#7AAACE] font-black uppercase tracking-widest mt-0.5">
                  Part {index + 1}
                </p>
              </div>

              <button
                onClick={() => onRemoveFile(item.id)}
                className="p-2 text-[#7AAACE]/40 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        <div className="relative group mt-2">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="border-4 border-dashed border-[#355872]/10 rounded-2xl py-8 flex items-center justify-center gap-3 text-[#7AAACE] group-hover:border-[#9CD5FF] group-hover:text-[#355872] group-hover:bg-[#9CD5FF]/5 transition-all cursor-pointer">
            <Plus className="w-6 h-6" />
            <span className="font-black text-sm uppercase tracking-widest">
              Add More Files
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onMerge}
        disabled={files.length < 2 || isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 border-4 border-[#F7F8F0]/30 border-t-[#F7F8F0] rounded-full animate-spin" />
            Merging...
          </span>
        ) : (
          <>
            <Download className="w-7 h-7" /> Merge & Download
          </>
        )}
      </button>

      <button
        onClick={onClearAll}
        className="text-xs font-black text-[#7AAACE] hover:text-red-500 transition-colors uppercase tracking-[0.3em] mx-auto"
      >
        Clear All
      </button>
    </div>
  );
}
