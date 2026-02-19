"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { UploadCloud, Scissors, Download } from "lucide-react";

export default function PDFCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState({ start: 1, end: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const totalPages = pdfDoc.getPageCount();
      const start = Math.max(1, pages.start);
      const end = Math.min(totalPages, pages.end);

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

  return (
    <div className="max-w-xl mx-auto p-8 border-2 border-dashed border-blue-200 rounded-3xl bg-white shadow-sm mt-8">
      {!file ? (
        <div className="text-center py-10 relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <p className="font-bold text-slate-700">
            Click or drag a PDF to upload
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Maximum privacy. Processed on your device.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 items-center py-4">
          <div className="text-center">
            <p className="font-bold text-slate-800 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-500" /> {file.name}
            </p>
            <button
              onClick={() => setFile(null)}
              className="text-xs text-red-500 hover:underline mt-2"
            >
              Remove file
            </button>
          </div>

          <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">
                START PAGE
              </label>
              <input
                type="number"
                min="1"
                value={pages.start}
                className="border p-2 w-24 rounded-lg text-center font-bold text-slate-700"
                onChange={(e) =>
                  setPages({ ...pages, start: Number(e.target.value) })
                }
              />
            </div>
            <span className="text-slate-300 font-bold mt-4">TO</span>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-500 mb-1">
                END PAGE
              </label>
              <input
                type="number"
                min="1"
                value={pages.end}
                className="border p-2 w-24 rounded-lg text-center font-bold text-slate-700"
                onChange={(e) =>
                  setPages({ ...pages, end: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-blue-600 flex items-center gap-2 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Download className="w-5 h-5" /> Crop & Download
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
