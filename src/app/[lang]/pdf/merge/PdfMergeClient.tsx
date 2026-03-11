"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import PdfNav from "@/components/nav/PdfNav";
import { useLanguage } from "@/context/LanguageContext";
import { useProcessingWarning } from "@/hooks/useProcessingWarning";

import PdfMergeUpload from "@/components/ui/PdfMergeUpload";
import PdfMergeWorkspace from "@/components/ui/PdfMergeWorkspace";

interface FileItem {
  id: string;
  file: File;
  insertAfterPage?: string;
  pageCount: number;
}

export default function PdfMergeClient() {
  const { t } = useLanguage();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Tab Close Protection Hook
  useProcessingWarning(isProcessing);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Filter out non-PDFs
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf",
    );
    if (validFiles.length !== selectedFiles.length) {
      alert("Some files were skipped. Please upload valid PDF documents only.");
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const availableSlots = Math.max(0, 2 - files.length);
    if (availableSlots === 0) {
      e.target.value = "";
      return;
    }

    const filesToProcess = validFiles.slice(0, availableSlots);
    setIsProcessing(true);

    try {
      const newFiles = await Promise.all(
        filesToProcess.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();

          return {
            id: Math.random().toString(36).substring(2, 11),
            file,
            insertAfterPage: "",
            pageCount,
          };
        }),
      );

      setFiles((prev) => [...prev, ...newFiles]);
    } catch (error) {
      console.error(error);
      alert(
        "Error reading PDF. Please ensure the file is not corrupted or password protected.",
      );
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handlePageChange = (id: string, value: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, insertAfterPage: value } : f)),
    );
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const draggedItem = newFiles[dragIndex];
      newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedItem);
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length !== 2) return;
    setIsProcessing(true);

    try {
      const baseBuffer = await files[0].file.arrayBuffer();
      const mergedPdf = await PDFDocument.load(baseBuffer);

      const insertItem = files[1];
      const arrayBuffer = await insertItem.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices(),
      );

      let insertIndex = mergedPdf.getPageCount();

      if (insertItem.insertAfterPage) {
        const parsedPage = parseInt(insertItem.insertAfterPage, 10);
        if (
          !isNaN(parsedPage) &&
          parsedPage > 0 &&
          parsedPage <= mergedPdf.getPageCount()
        ) {
          insertIndex = parsedPage;
        }
      }

      for (let j = 0; j < copiedPages.length; j++) {
        mergedPdf.insertPage(insertIndex + j, copiedPages[j]);
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Merged_HisPDF.pdf`;
      link.click();
    } catch (error) {
      console.error(error);
      alert(
        "Something went wrong during merging! Ensure files are valid PDFs.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

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
            onRemoveFile={removeFile}
            onPageChange={handlePageChange}
            onClearAll={clearAllFiles}
            onMerge={handleMerge}
            onReorder={handleReorder}
          />
        )}
      </div>
    </PageShell>
  );
}
