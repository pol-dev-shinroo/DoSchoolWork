"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import PdfNav from "@/components/nav/PdfNav";
import { useLanguage } from "@/context/LanguageContext";

// Import Dumb UI components
import PdfMergeUpload from "@/components/ui/PdfMergeUpload";
import PdfMergeWorkspace from "@/components/ui/PdfMergeWorkspace";

interface FileItem {
  id: string;
  file: File;
}

export default function PdfMergeClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 2. LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    [newFiles[index], newFiles[targetIndex]] = [
      newFiles[targetIndex],
      newFiles[index],
    ];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Merged_DoSchoolWork.pdf`;
      link.click();
    } catch (error) {
      alert("Something went wrong during merging!");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.pdfMerge.title}
      description={t.pdfMerge.description}
      navToggle={<PdfNav active="merge" />}
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {files.length === 0 ? (
          <PdfMergeUpload onFileChange={handleFileChange} />
        ) : (
          <PdfMergeWorkspace
            files={files}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
            onMoveFile={moveFile}
            onRemoveFile={removeFile}
            onClearAll={clearAllFiles}
            onMerge={handleMerge}
          />
        )}
      </div>
    </PageShell>
  );
}
