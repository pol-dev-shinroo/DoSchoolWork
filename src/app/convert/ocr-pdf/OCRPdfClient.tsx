"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import Dumb UI components
import OcrPdfUpload from "@/components/ui/OcrPdfUpload";
import OcrPdfWorkspace from "@/components/ui/OcrPdfWorkspace";

// Define what we expect Tesseract to give us when we ask for a PDF
interface TesseractPdfData {
  pdf?: number[];
}

export default function OCRPdfClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  // --- 2. LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setProgressStatus("");
  };

  const handleOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressStatus("Initializing Engine...");

    let worker: Tesseract.Worker | null = null;

    try {
      // 1. Load PDF.js dynamically
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const outPdf = await PDFDocument.create();

      // 2. Initialize a persistent Tesseract Worker
      worker = await Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgressStatus(`Scanning: ${(m.progress * 100).toFixed(0)}%`);
          }
        },
      });

      // 3. Loop through every page
      for (let i = 1; i <= numPages; i++) {
        setProgressStatus(`Preparing Page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2.0 }); // High scale for better OCR
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas context failed to initialize.");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const imgBytes = await fetch(imgDataUrl).then((res) =>
          res.arrayBuffer(),
        );

        setProgressStatus(`Scanning Page ${i} text...`);

        // 4. Ask Tesseract to output a native Searchable PDF for this specific page
        const result = await worker.recognize(
          imgDataUrl,
          { pdfTitle: `Page ${i}` },
          { pdf: true }, // Commands Tesseract to return a native PDF file
        );

        setProgressStatus(`Reconstructing Page ${i}...`);

        // 5. Safely access the PDF data by casting to unknown first, then to our strict interface
        const data = result.data as unknown as TesseractPdfData;

        if (data.pdf) {
          // Tesseract gives us a perfect "Text Rendering Mode 3" PDF page
          // We load it, and copy it into our final document
          const tesseractPdf = await PDFDocument.load(new Uint8Array(data.pdf));
          const copiedPages = await outPdf.copyPages(tesseractPdf, [0]);
          outPdf.addPage(copiedPages[0]);
        } else {
          // Fallback: If no text was found, just insert the image normally
          const embeddedImage = await outPdf.embedJpg(imgBytes);
          const newPage = outPdf.addPage([canvas.width, canvas.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
          });
        }
      }

      setProgressStatus("Finalizing Document...");
      const pdfBytes = await outPdf.save();

      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Searchable_${file.name}`;
      link.click();
    } catch (error) {
      console.error("[OCR Engine Error]:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`OCR Engine failed: ${errorMessage}`);
    } finally {
      // 6. Cleanup the worker so it doesn't consume background memory
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.ocrPdf.title}
      description={t.ocrPdf.description}
      navToggle={<ConvertNav active="ocr-pdf" />}
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8">
        {!file ? (
          <OcrPdfUpload onFileChange={handleFileChange} />
        ) : (
          <OcrPdfWorkspace
            fileName={file.name}
            isProcessing={isProcessing}
            progressStatus={progressStatus}
            onClear={handleClear}
            onProcess={handleOCR}
          />
        )}
      </div>
    </PageShell>
  );
}
