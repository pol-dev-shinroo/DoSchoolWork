"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import PdfNav from "@/components/nav/PdfNav";
import { useLanguage } from "@/context/LanguageContext";
import { useProcessingWarning } from "@/hooks/useProcessingWarning";

import PdfCropUpload from "@/components/ui/PdfCropUpload";
import PdfCropWorkspace from "@/components/ui/PdfCropWorkspace";

export default function PdfCropClient() {
  const { t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pages, setPages] = useState({ start: 1, end: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  // UPDATED: Now passing the translated string from our dictionary!
  useProcessingWarning(isProcessing, t.common.processingWarning);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Invalid file type. Please upload a valid PDF document.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();
      setTotalPages(count);
      setPages({ start: 1, end: count });
    } catch (err) {
      console.error("Error loading PDF info:", err);
      alert(
        "Error loading PDF. The file may be corrupted or password protected.",
      );
      setFile(null);
    }
    e.target.value = "";
  };

  const handleClear = () => {
    setFile(null);
    setTotalPages(null);
    setPages({ start: 1, end: 1 });
  };

  const handlePageChange = (type: "start" | "end", value: number) => {
    setPages((prev) => ({ ...prev, [type]: value }));
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
      link.download = `Split_${file.name}`;
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
    <PageShell
      title={t.pdfCrop.title}
      description={t.pdfCrop.description}
      navToggle={<PdfNav active="split" />} // Validated: active="split" is correct here!
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!file ? (
          <PdfCropUpload onFileChange={handleFileChange} />
        ) : (
          <PdfCropWorkspace
            fileName={file.name}
            totalPages={totalPages}
            pages={pages}
            isProcessing={isProcessing}
            isInvalid={isInvalid}
            onClear={handleClear}
            onPageChange={handlePageChange}
            onProcess={handleProcess}
          />
        )}
      </div>
    </PageShell>
  );
}
