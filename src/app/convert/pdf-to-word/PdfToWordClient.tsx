"use client";

import React, { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import Dumb UI components
import PdfToWordUpload from "@/components/ui/PdfToWordUpload";
import PdfToWordWorkspace from "@/components/ui/PdfToWordWorkspace";

// 1. TypeScript Interface for PDF.js text items
interface PDFTextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, translateX, translateY]
}

export default function PdfToWordClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");

  // --- 2. WORKER INIT ---
  useEffect(() => {
    import("pdfjs-dist").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  // --- 3. LOGIC ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setProgress("");
  };

  const convertToWord = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress("Analyzing PDF...");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const docParagraphs: Paragraph[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Extracting page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        const items = textContent.items as unknown as PDFTextItem[];
        let lastY: number | null = null;
        let lineText = "";

        // Text re-assembly logic based on vertical position
        items.forEach((item) => {
          const currentY = item.transform[5];

          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            docParagraphs.push(
              new Paragraph({
                children: [new TextRun(lineText.trim())],
              }),
            );
            lineText = "";
          }
          lineText += item.str + " ";
          lastY = currentY;
        });

        // Add the last line of the page
        if (lineText) {
          docParagraphs.push(
            new Paragraph({
              children: [new TextRun(lineText.trim())],
            }),
          );
        }

        // Add a page break between pages
        if (i < pdf.numPages) {
          docParagraphs.push(
            new Paragraph({ text: "", pageBreakBefore: true }),
          );
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docParagraphs,
          },
        ],
      });

      setProgress("Generating .docx file...");
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Editable_${file.name.replace(".pdf", "")}.docx`);
    } catch (error) {
      console.error("Conversion error:", error);
      alert(
        "Something went wrong during conversion. Please try a simpler PDF.",
      );
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  // --- 4. RENDER ---
  return (
    <PageShell
      title={t.pdfToWord.title}
      description={t.pdfToWord.description}
      navToggle={<ConvertNav active="pdf-to-word" />}
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!file ? (
          <PdfToWordUpload onFileChange={handleFileChange} />
        ) : (
          <PdfToWordWorkspace
            fileName={file.name}
            isProcessing={isProcessing}
            progress={progress}
            onClear={handleClear}
            onConvert={convertToWord}
          />
        )}
      </div>
    </PageShell>
  );
}
