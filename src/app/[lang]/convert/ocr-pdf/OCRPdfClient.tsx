"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

import OcrPdfUpload from "@/components/ui/OcrPdfUpload";
import OcrPdfWorkspace from "@/components/ui/OcrPdfWorkspace";
import { useProcessingWarning } from "@/hooks/useProcessingWarning";

interface TesseractPdfData {
  pdf?: number[];
}

export interface PreviewChunk {
  title: string;
  url: string;
}

export default function OCRPdfClient() {
  const { t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  const [previews, setPreviews] = useState<PreviewChunk[]>([]);

  // Tab Close Protection
  useProcessingWarning(isProcessing);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Invalid file type. Please upload a valid PDF document.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setPreviews([]); // Always reset on fresh upload
  };

  const handleClear = () => {
    setFile(null);
    setProgressStatus("");
    setPreviews([]);
  };

  const handleOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressStatus("Initializing Engine...");

    let worker: Tesseract.Worker | null = null;
    const CHUNK_SIZE = 20;

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      let outPdf = await PDFDocument.create();
      let chunkStartPage = 1;

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

        // TRIGGER PACKAGING LOGIC
        if (i % CHUNK_SIZE === 0 || i === numPages) {
          setProgressStatus(`Packaging Pages ${chunkStartPage}-${i}...`);

          const pdfBytes = await outPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(blob);
          const baseName = file.name.replace(/\.pdf$/i, "");

          // FIX: Branch the logic based on total document size!
          if (numPages <= CHUNK_SIZE) {
            // SMALL FILE FLOW: Just auto-download at the end. No previews needed.
            if (i === numPages) {
              const link = document.createElement("a");
              link.href = url;
              link.download = `Searchable_${baseName}.pdf`;
              link.click();
            }
          } else {
            // LARGE FILE FLOW: Use the Milestones Preview system
            const chunkTitle = `Pages_${chunkStartPage}-${i}`;
            setPreviews((prev) => [...prev, { title: chunkTitle, url }]);

            if (i === numPages) {
              const link = document.createElement("a");
              link.href = url;
              link.download = `Searchable_${baseName}_(Part_${chunkStartPage}-${i}).pdf`;
              link.click();
            } else {
              outPdf = await PDFDocument.create();
              chunkStartPage = i + 1;
            }
          }
        }
      }
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
            previews={previews} // Will be empty if file <= 20 pages!
            onClear={handleClear}
            onProcess={handleOCR}
          />
        )}
      </div>
    </PageShell>
  );
}
