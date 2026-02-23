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
    
    // Reset input so the same file can be selected again if needed
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
    <div className="max-w-xl mx-auto p-10 border-2 border-dashed border-indigo-100 rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8 transition-all">
      {files.length === 0 ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <FileStack className="w-10 h-10 text-indigo-500" />
          </div>
          <p className="font-bold text-xl text-slate-800">
            Upload PDFs to Merge
          </p>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Select multiple files to combine them.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="text-center">
             <h2 className="text-xl font-bold text-slate-800">Merge List</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
               {files.length} Files Selected
             </p>
          </div>

          <div className="flex flex-col gap-3">
            {files.map((item, index) => {
              const isDuplicateName = files.filter(f => f.file.name === item.file.name).length > 1;
              
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-indigo-100/20"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="text-slate-300 hover:text-indigo-500 disabled:opacity-0 transition-colors"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="text-slate-300 hover:text-indigo-500 disabled:opacity-0 transition-colors"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-700 truncate text-sm">
                        {item.file.name}
                      </p>
                      {isDuplicateName && (
                        <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          Same Name
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      Part {index + 1}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
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
              <div className="border-2 border-dashed border-slate-200 rounded-2xl py-6 flex items-center justify-center gap-3 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-500 transition-all cursor-pointer">
                <Plus className="w-5 h-5" />
                <span className="font-bold text-sm">Add More Files</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isProcessing}
            className="w-full bg-slate-950 flex items-center justify-center gap-3 text-white px-8 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-slate-200 disabled:shadow-none"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Merging...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" /> Merge & Download
              </>
            )}
          </button>
          
          <button 
            onClick={() => setFiles([])}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest mx-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
