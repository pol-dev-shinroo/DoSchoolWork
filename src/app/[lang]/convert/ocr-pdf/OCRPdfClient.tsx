"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";
import { PDFDocument } from "pdf-lib";

import OcrPdfUpload from "@/components/ui/OcrPdfUpload";
import OcrPdfWorkspace from "@/components/ui/OcrPdfWorkspace";
import { useProcessingWarning } from "@/hooks/useProcessingWarning";

export interface PreviewChunk {
  title: string;
  url: string;
}

export default function OCRPdfClient() {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");
  const [previews, setPreviews] = useState<PreviewChunk[]>([]);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // FIX 1: Passed the translated warning message as the second argument!
  useProcessingWarning(isProcessing, t.common.processingWarning);

  useEffect(() => {
    if (isProcessing) {
      progressIntervalRef.current = setInterval(() => {
        setAnimatedProgress((prev) => {
          if (prev < targetProgressRef.current - 5)
            return prev + Math.floor(Math.random() * 3) + 1;
          if (prev < targetProgressRef.current - 1) return prev + 1;
          return prev;
        });
      }, 400);
    } else {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreviews([]);
    setAnimatedProgress(0);
  };

  const handleClear = () => {
    setFile(null);
    setProgressStatus("");
    setAnimatedProgress(0);
    setPreviews([]);
  };

  const handleOCR = async () => {
    if (!file) return;

    setIsProcessing(true);
    setPreviews([]);
    setAnimatedProgress(0);
    targetProgressRef.current = 5;

    try {
      setProgressStatus("Analyzing document structure...");

      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = originalPdf.getPageCount();

      // ==========================================
      // The 50-Page Limit & Split Redirect
      // ==========================================
      if (totalPages > 50) {
        setIsProcessing(false);

        // Use the dynamically translated string we created earlier
        const alertMessage = t.ocrPdf.pageLimitConfirm.replace(
          "{{count}}",
          totalPages.toString(),
        );

        const userWantsToCrop = window.confirm(alertMessage);

        if (userWantsToCrop) {
          // FIX 2: Correctly routes to the new /split page!
          router.push(`/${locale}/pdf/split`);
        }
        return;
      }
      // ==========================================

      const CHUNK_SIZE = 20;
      const totalChunks = Math.ceil(totalPages / CHUNK_SIZE);
      const processedPdfBytesArray: Uint8Array[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const startPage = i * CHUNK_SIZE;
        const endPage = Math.min(startPage + CHUNK_SIZE, totalPages) - 1;

        targetProgressRef.current = Math.round(((i + 1) / totalChunks) * 95);
        setProgressStatus(
          `Processing Pages ${startPage + 1} to ${endPage + 1}...`,
        );

        const chunkPdf = await PDFDocument.create();
        const pageIndices = Array.from(
          { length: endPage - startPage + 1 },
          (_, k) => startPage + k,
        );
        const copiedPages = await chunkPdf.copyPages(originalPdf, pageIndices);
        copiedPages.forEach((page) => chunkPdf.addPage(page));

        const chunkBytes = await chunkPdf.save();
        const chunkBlob = new Blob([new Uint8Array(chunkBytes)], {
          type: "application/pdf",
        });
        const chunkFile = new File([chunkBlob], `chunk.pdf`, {
          type: "application/pdf",
        });

        const formData = new FormData();
        formData.append("file", chunkFile);

        // The URL is now pointing to your live Hugging Face server!
        const response = await fetch(
          "https://lewigolski-hispdf-engine.hf.space/ocr",
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok)
          throw new Error(
            `Server failed on pages ${startPage + 1}-${endPage + 1}`,
          );

        const processedBlob = await response.blob();
        const processedBytes = new Uint8Array(
          await processedBlob.arrayBuffer(),
        );
        processedPdfBytesArray.push(processedBytes);

        if (totalChunks > 1) {
          const localUrl = URL.createObjectURL(processedBlob);
          setPreviews((prev) => [
            ...prev,
            { title: `Pages ${startPage + 1}-${endPage + 1}`, url: localUrl },
          ]);
        }

        setAnimatedProgress(targetProgressRef.current);
      }

      setProgressStatus("Gluing document back together...");
      targetProgressRef.current = 100;

      const finalPdf = await PDFDocument.create();
      for (const processedBytes of processedPdfBytesArray) {
        const tempDoc = await PDFDocument.load(processedBytes);
        const tempPages = await finalPdf.copyPages(
          tempDoc,
          tempDoc.getPageIndices(),
        );
        tempPages.forEach((page) => finalPdf.addPage(page));
      }

      const finalBytes = await finalPdf.save();
      const finalBlob = new Blob([new Uint8Array(finalBytes)], {
        type: "application/pdf",
      });
      const finalUrl = URL.createObjectURL(finalBlob);

      const baseName = file.name.replace(/\.pdf$/i, "");
      const link = document.createElement("a");
      link.href = finalUrl;
      link.download = `Searchable_${baseName}.pdf`;
      link.click();

      setAnimatedProgress(100);
    } catch (error) {
      console.error("[OCR API Error]:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
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
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 text-[#355872]">
        {!file ? (
          <OcrPdfUpload onFileChange={handleFileChange} />
        ) : (
          <OcrPdfWorkspace
            fileName={file.name}
            isProcessing={isProcessing}
            progressStatus={
              isProcessing
                ? `${progressStatus} (${animatedProgress}%)`
                : progressStatus
            }
            previews={previews}
            onClear={handleClear}
            onProcess={handleOCR}
          />
        )}
      </div>
    </PageShell>
  );
}
