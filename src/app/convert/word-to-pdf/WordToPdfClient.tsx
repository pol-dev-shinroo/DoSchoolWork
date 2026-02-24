"use client";

import React, { useState, useRef } from "react";
import mammoth from "mammoth";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import our new Dumb UI components
import WordToPdfUpload from "@/components/ui/WordToPdfUpload";
import WordToPdfWorkspace from "@/components/ui/WordToPdfWorkspace";

export default function WordToPdfClient() {
  const { t } = useLanguage();

  // --- 1. STATE & REFS ---
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // --- 2. LOGIC ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value);
    } catch (error) {
      console.error("Error reading Word document:", error);
      alert("Could not process this .docx file.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setHtmlContent("");
  };

  const generatePdf = async () => {
    if (!contentRef.current || !file) return;
    setIsProcessing(true);

    try {
      // Dynamically import html2pdf to avoid SSR window issues
      const html2pdf = (await import("html2pdf.js")).default;
      const element = contentRef.current;
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `DoSchoolWork_${file.name.replace(".docx", "")}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Something went wrong while generating your PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.wordToPdf.title}
      description={t.wordToPdf.description}
      navToggle={<ConvertNav active="word-to-pdf" />}
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!file ? (
          <WordToPdfUpload onFileChange={handleFileChange} />
        ) : (
          <WordToPdfWorkspace
            fileName={file.name}
            isProcessing={isProcessing}
            htmlContent={htmlContent}
            contentRef={contentRef}
            onClear={handleClear}
            onConvert={generatePdf}
          />
        )}
      </div>
    </PageShell>
  );
}
