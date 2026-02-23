"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, FileStack, Download, Trash2, MoveUp, MoveDown, Plus } from "lucide-react";

interface FileItem {
  id: string;
  file: File;
}

export default function PDFMerger() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Merged_DoSchoolWork.pdf`;
      link.click();
    } catch (error) {
      alert("Something went wrong during merging!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {files.length === 0 ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <FileStack className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">
            Merge Documents
          </p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            Select files to combine
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="text-center">
             <h2 className="text-xl font-black text-[#355872]">Merge List</h2>
             <p className="text-[10px] text-[#7AAACE] font-black uppercase tracking-[0.3em] mt-2">
               {files.length} Documents
             </p>
          </div>

          <div className="flex flex-col gap-4">
            {files.map((item, index) => {
              const isDuplicateName = files.filter(f => f.file.name === item.file.name).length > 1;
              
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-[#F7F8F0]/50 p-5 rounded-2xl border-2 border-[#355872]/5 group transition-all hover:bg-white hover:shadow-xl hover:shadow-[#355872]/5"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="text-[#7AAACE]/40 hover:text-[#355872] disabled:opacity-0 transition-colors"
                    >
                      <MoveUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
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
                    onClick={() => removeFile(item.id)}
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
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-4 border-dashed border-[#355872]/10 rounded-2xl py-8 flex items-center justify-center gap-3 text-[#7AAACE] group-hover:border-[#9CD5FF] group-hover:text-[#355872] group-hover:bg-[#9CD5FF]/5 transition-all cursor-pointer">
                <Plus className="w-6 h-6" />
                <span className="font-black text-sm uppercase tracking-widest">Add More Files</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMerge}
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
            onClick={() => setFiles([])}
            className="text-xs font-black text-[#7AAACE] hover:text-red-500 transition-colors uppercase tracking-[0.3em] mx-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
