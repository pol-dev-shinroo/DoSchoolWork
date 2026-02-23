"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Scissors, Download } from "lucide-react";

export default function PDFCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pages, setPages] = useState({ start: 1, end: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setPages({ start: 1, end: count });
      } catch (err) {
        console.error("Error loading PDF info:", err);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const totalPagesCount = pdfDoc.getPageCount();
      const start = Math.max(1, pages.start);
      const end = Math.min(totalPagesCount, pages.end);

      if (start > end) {
        alert("Start page cannot be greater than end page.");
        setIsProcessing(false);
        return;
      }

      const pageIndices = Array.from(
        { length: end - start + 1 },
        (_, i) => start + i - 1,
      );

      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `DoSchoolWork_${file.name}`;
      link.click();
    } catch (error) {
      alert(
        "Something went wrong! Make sure the file isn't password protected.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isInvalid =
    !totalPages ||
    pages.start < 1 ||
    pages.end > totalPages ||
    pages.start > pages.end;

  return (
    <div className="max-w-xl mx-auto p-10 border-2 border-dashed border-indigo-100 rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8 transition-all">
      {!file ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-10 h-10 text-indigo-500" />
          </div>
          <p className="font-bold text-xl text-slate-800">
            Click or drag a PDF to upload
          </p>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Maximum privacy. Processed on your device.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center py-2">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <Scissors className="w-5 h-5 text-indigo-500" />
              <p className="font-bold text-slate-700 truncate max-w-[200px]">
                {file.name}
              </p>
              {totalPages && (
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {totalPages} pages
                </span>
              )}
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setFile(null);
                  setTotalPages(null);
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
              >
                Change File
              </button>
            </div>
          </div>

          <div className="flex gap-6 items-center w-full justify-center">
            <div className="flex flex-col items-center">
              <label className="text-[11px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">
                Start
              </label>
              <input
                type="number"
                min="1"
                value={pages.start || ""}
                className={`border-2 bg-slate-50/50 p-4 w-28 rounded-2xl text-center text-lg font-black text-slate-800 outline-none transition-all ${
                  pages.start < 1 || pages.start > (totalPages || 0)
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-transparent focus:border-indigo-400 focus:bg-white focus:shadow-xl focus:shadow-indigo-100/50"
                }`}
                onChange={(e) =>
                  setPages({ ...pages, start: Number(e.target.value) })
                }
              />
            </div>

            <div className="h-0.5 w-6 bg-slate-200 mt-6 rounded-full" />

            <div className="flex flex-col items-center">
              <label className="text-[11px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">
                End
              </label>
              <input
                type="number"
                min="1"
                value={pages.end || ""}
                className={`border-2 bg-slate-50/50 p-4 w-28 rounded-2xl text-center text-lg font-black text-slate-800 outline-none transition-all ${
                  pages.end > (totalPages || 0) || pages.end < pages.start
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-transparent focus:border-indigo-400 focus:bg-white focus:shadow-xl focus:shadow-indigo-100/50"
                }`}
                onChange={(e) =>
                  setPages({ ...pages, end: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {isInvalid && (
            <p className="text-xs font-bold text-rose-500 animate-pulse">
              Invalid range for this {totalPages} page document
            </p>
          )}

          <button
            onClick={handleProcess}
            disabled={isProcessing || isInvalid}
            className="w-full bg-slate-950 flex items-center justify-center gap-3 text-white px-8 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-slate-200 disabled:shadow-none"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <Download className="w-6 h-6" /> Export PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
