"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import Dumb UI components
import OcrPdfUpload from "@/components/ui/OcrPdfUpload";
import OcrPdfWorkspace from "@/components/ui/OcrPdfWorkspace";

interface TesseractPdfData {
  pdf?: number[];
}

export default function OCRPdfClient() {
  const { t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  // ==========================================
  // STEP 2: TAB CLOSE PROTECTION
  // Warns the user if they try to close the tab while processing
  // ==========================================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome to show the warning dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isProcessing]);

  // ==========================================
  // STEP 2: WRONG FILE ALERT
  // Blocks non-PDF files from being uploaded
  // ==========================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Strict validation check
    if (selectedFile.type !== "application/pdf") {
      alert("Invalid file type. Please upload a valid PDF document.");
      e.target.value = ""; // Reset the input
      return;
    }

    setFile(selectedFile);
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
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      const outPdf = await PDFDocument.create();

      worker = await Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgressStatus(`Scanning: ${(m.progress * 100).toFixed(0)}%`);
          }
        },
      });

      for (let i = 1; i <= numPages; i++) {
        setProgressStatus(`Preparing Page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: 2.0 });
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

        const result = await worker.recognize(
          imgDataUrl,
          { pdfTitle: `Page ${i}` },
          { pdf: true },
        );

        setProgressStatus(`Reconstructing Page ${i}...`);

        const data = result.data as unknown as TesseractPdfData;

        if (data.pdf) {
          const tesseractPdf = await PDFDocument.load(new Uint8Array(data.pdf));
          const copiedPages = await outPdf.copyPages(tesseractPdf, [0]);
          outPdf.addPage(copiedPages[0]);
        } else {
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
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

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
