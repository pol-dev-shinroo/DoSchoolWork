"use client";

import { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  UploadCloud,
  FileSearch,
  Download,
  Trash2,
  Loader2,
} from "lucide-react";

// 1. Define the exact shape of Tesseract's word data to satisfy TypeScript
interface TesseractWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

interface TesseractData {
  words: TesseractWord[];
}

export default function OCRPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  useEffect(() => {
    import("pdfjs-dist")
      .then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      })
      .catch((err) => console.error("Failed to load pdfjs worker", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressStatus("Initializing Engine...");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const Tesseract = (await import("tesseract.js")).default;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const outPdf = await PDFDocument.create();
      const font = await outPdf.embedFont(StandardFonts.Helvetica);

      for (let i = 1; i <= numPages; i++) {
        setProgressStatus(`Preparing Page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas context failed");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const imgBytes = await fetch(imgDataUrl).then((res) =>
          res.arrayBuffer(),
        );

        setProgressStatus(`Scanning Page ${i} text...`);
        const result = await Tesseract.recognize(imgDataUrl, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgressStatus(
                `Scanning Page ${i}: ${(m.progress * 100).toFixed(0)}%`,
              );
            }
          },
        });

        // 2. Use the interface instead of 'any'
        const data = result.data as unknown as TesseractData;
        const words = data.words;

        setProgressStatus(`Reconstructing Page ${i}...`);
        const embeddedImage = await outPdf.embedJpg(imgBytes);
        const newPage = outPdf.addPage([canvas.width, canvas.height]);

        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });

        words.forEach((word) => {
          const bbox = word.bbox;
          const wordHeight = bbox.y1 - bbox.y0;
          const pdfY = canvas.height - bbox.y1;

          newPage.drawText(word.text, {
            x: bbox.x0,
            y: pdfY,
            size: wordHeight > 0 ? wordHeight : 8,
            font: font,
            color: rgb(0, 0, 0),
            opacity: 0,
          });
        });
      }

      setProgressStatus("Finalizing Document...");
      const pdfBytes = await outPdf.save();

      // 3. Explicitly create a new Uint8Array to satisfy the Blob constructor
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Searchable_${file.name}`;
      link.click();
    } catch (error) {
      console.error(error);
      alert("An error occurred during OCR.");
    } finally {
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8">
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
            Upload Scanned PDF
          </p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            Maximum Privacy - Processed Locally
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center py-2">
          <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileSearch className="w-5 h-5 text-[#355872] flex-shrink-0" />
              <p className="font-black text-[#355872] truncate max-w-[240px]">
                {file.name}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              disabled={isProcessing}
              className="text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-xl text-center">
            <p className="text-xs font-bold text-[#355872]/80">
              <span className="font-black text-[#355872]">Note:</span> Text
              recognition is intensive and runs entirely on your device&apos;s
              processor to protect your privacy.
            </p>
          </div>

          <button
            onClick={handleOCR}
            disabled={isProcessing}
            className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                {progressStatus || "Processing..."}
              </span>
            ) : (
              <>
                <Download className="w-7 h-7" /> Make Searchable
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
