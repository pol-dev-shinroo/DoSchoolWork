"use client";

import React, { useState, useRef } from "react";
import { renderAsync } from "docx-preview";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

import WordToPdfUpload from "@/components/ui/WordToPdfUpload";
import WordToPdfWorkspace from "@/components/ui/WordToPdfWorkspace";

export default function WordToPdfClient() {
  const { t } = useLanguage();

  // --- 1. STATE & REFS ---
  const [file, setFile] = useState<File | null>(null);
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

      if (contentRef.current) {
        // Clear previous content
        contentRef.current.innerHTML = "";

        // Render the DOCX with high fidelity into the div
        await renderAsync(arrayBuffer, contentRef.current, contentRef.current, {
          className: "docx_viewer",
          inWrapper: false,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          useBase64URL: true,
          experimental: true,
        });
      }
    } catch (error) {
      console.error("Error rendering Word document:", error);
      alert("Could not render this .docx file.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
  };

  const generatePdf = async () => {
    if (!contentRef.current || !file) return;
    setIsProcessing(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = contentRef.current;

      const opt = {
        // Explicitly typed tuple to satisfy TypeScript
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `DoSchoolWork_${file.name.replace(".docx", "")}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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
            contentRef={contentRef}
            onClear={handleClear}
            onConvert={generatePdf}
          />
        )}
      </div>
    </PageShell>
  );
}
