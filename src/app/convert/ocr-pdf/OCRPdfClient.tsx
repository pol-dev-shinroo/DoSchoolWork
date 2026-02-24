"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import Dumb UI components
import OcrPdfUpload from "@/components/ui/OcrPdfUpload";
import OcrPdfWorkspace from "@/components/ui/OcrPdfWorkspace";

// Tesseract Interfaces
interface TesseractWord {
  text: string;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

interface TesseractData {
  words: TesseractWord[];
}

export default function OCRPdfClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  // --- 2. WORKER INIT ---
  useEffect(() => {
    import("pdfjs-dist")
      .then((pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      })
      .catch((err) => console.error("Failed to load pdfjs worker", err));
  }, []);

  // --- 3. LOGIC ---
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
            opacity: 0, // Hidden text layer for searchability
          });
        });
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
      console.error(error);
      alert("An error occurred during OCR. Check console for details.");
    } finally {
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

  // --- 4. RENDER ---
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
