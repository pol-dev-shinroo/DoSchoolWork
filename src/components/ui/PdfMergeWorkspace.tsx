import React from "react";
import {
  Trash2,
  Plus,
  Download,
  GripVertical,
  Info,
  AlertCircle,
} from "lucide-react";

interface FileItem {
  id: string;
  file: File;
  insertAfterPage?: string;
  pageCount: number; // Inherited from the new state
}

interface PdfMergeWorkspaceProps {
  files: FileItem[];
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  onPageChange: (id: string, value: string) => void;
  onClearAll: () => void;
  onMerge: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

export default function PdfMergeWorkspace({
  files,
  isProcessing,
  onFileChange,
  onRemoveFile,
  onPageChange,
  onClearAll,
  onMerge,
  onReorder,
}: PdfMergeWorkspaceProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      onReorder(sourceIndex, targetIndex);
    }
  };

  // ==========================================
  // ERROR CHECKING LOGIC
  // Checks if the user's input exceeds the Base Document's page count
  // ==========================================
  const basePageCount = files[0]?.pageCount || 0;
  const insertInputValue = parseInt(files[1]?.insertAfterPage || "0", 10);

  const isInputInvalid =
    files.length === 2 &&
    files[1].insertAfterPage !== "" &&
    (insertInputValue > basePageCount || insertInputValue < 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-xl font-black text-[#355872]">Merge List</h2>
        <p className="text-[10px] text-[#7AAACE] font-black uppercase tracking-[0.3em] mt-2">
          {files.length} / 2 Documents
        </p>
      </div>

      {files.length === 2 && (
        <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-2xl flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#355872] shrink-0 mt-0.5" />
          <div className="text-sm text-[#355872]">
            <p className="font-bold mb-1">How merging works:</p>
            <p className="opacity-80 leading-relaxed text-xs">
              The top file is your <strong>Base Document</strong> (
              {basePageCount} pages). To insert the second file directly inside
              it, type a page number. Leave it blank to add it to the end.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {files.map((item, index) => {
          const isDuplicateName =
            files.filter((f) => f.file.name === item.file.name).length > 1;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-start gap-3 p-5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing hover:shadow-xl hover:shadow-[#355872]/5 ${
                index === 0
                  ? "bg-[#355872] border-[#355872]"
                  : "bg-[#F7F8F0]/50 border-[#355872]/5 hover:bg-white hover:border-[#9CD5FF]/50"
              }`}
            >
              <div
                className={`mt-2 ${index === 0 ? "text-[#F7F8F0]/50" : "text-[#7AAACE]/40"}`}
              >
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-bold truncate text-sm ${index === 0 ? "text-white" : "text-[#355872]"}`}
                  >
                    {item.file.name}
                  </p>
                  {isDuplicateName && (
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${index === 0 ? "bg-white/20 text-white" : "bg-[#9CD5FF]/30 text-[#355872]"}`}
                    >
                      Same Name
                    </span>
                  )}
                </div>

                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${index === 0 ? "text-[#9CD5FF]" : "text-[#7AAACE]"}`}
                >
                  {index === 0
                    ? `Base Document • ${item.pageCount} Pages`
                    : `Insert Document • ${item.pageCount} Pages`}
                </p>

                {/* THE UPGRADED INPUT WITH WARNINGS */}
                {index > 0 && (
                  <div className="mt-3 flex flex-col gap-1">
                    <div
                      className={`flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border w-max shadow-sm transition-colors ${isInputInvalid ? "border-red-400" : "border-[#355872]/10"}`}
                      onDragStart={(e) => e.preventDefault()}
                      draggable="false"
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${isInputInvalid ? "text-red-500" : "text-[#355872]"}`}
                      >
                        Insert after page:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={basePageCount}
                        placeholder={`Max ${basePageCount}`}
                        value={item.insertAfterPage || ""}
                        onChange={(e) => onPageChange(item.id, e.target.value)}
                        className={`w-16 text-xs font-bold bg-transparent outline-none placeholder:text-[#7AAACE]/50 ${isInputInvalid ? "text-red-500" : "text-[#355872]"}`}
                      />
                    </div>
                    {isInputInvalid && (
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> Exceeds base
                        document length ({basePageCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onRemoveFile(item.id)}
                className={`p-2 transition-colors mt-0.5 ${
                  index === 0
                    ? "text-[#F7F8F0]/50 hover:text-red-300"
                    : "text-[#7AAACE]/40 hover:text-red-500"
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        {files.length < 2 && (
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
                Add Second File
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BUTTON NOW DISABLES IF INPUT IS INVALID */}
      <button
        onClick={onMerge}
        disabled={files.length !== 2 || isProcessing || isInputInvalid}
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
