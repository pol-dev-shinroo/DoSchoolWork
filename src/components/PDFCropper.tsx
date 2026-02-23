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
      alert("Something went wrong! Make sure the file isn't password protected.");
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
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {!file ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">
            Upload Assignment
          </p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            100% Client-Side Processing
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 items-center py-2">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10">
              <Scissors className="w-5 h-5 text-[#355872]" />
              <p className="font-black text-[#355872] truncate max-w-[240px]">
                {file.name}
              </p>
              {totalPages && (
                <span className="text-[10px] font-black bg-[#355872] text-[#F7F8F0] px-2 py-1 rounded-lg">
                  {totalPages} PG
                </span>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setFile(null);
                  setTotalPages(null);
                }}
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
                onChange={(e) =>
                  setPages({ ...pages, start: Number(e.target.value) })
                }
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
                onChange={(e) =>
                  setPages({ ...pages, end: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <button
            onClick={handleProcess}
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
      )}
    </div>
  );
}
