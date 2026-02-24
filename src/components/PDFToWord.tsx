"use client";

import { useState, useEffect } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { UploadCloud, FileType, Download, Trash2, Loader2 } from "lucide-react";

// 1. Define the specific interface for PDF.js text items to satisfy TypeScript
interface PDFTextItem {
  str: string;
  transform: number[]; // [scaleX, skewX, skewY, scaleY, translateX, translateY]
}

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    import("pdfjs-dist").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
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
        setProgress(`Extracting page ${i}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // 2. Cast the items to our specific interface instead of 'any'
        const items = textContent.items as unknown as PDFTextItem[];
        let lastY: number | null = null;
        let lineText = "";

        items.forEach((item) => {
          const currentY = item.transform[5]; // The vertical position

          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            // New line detected based on Y-coordinate shift
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
      alert("Something went wrong during conversion.");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {!file ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <FileType className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">Upload PDF</p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            Extract Text to Word
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center py-2">
          <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileType className="w-5 h-5 text-[#355872] flex-shrink-0" />
              <p className="font-black text-[#355872] truncate max-w-[240px]">
                {file.name}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              disabled={isProcessing}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={convertToWord}
            disabled={isProcessing}
            className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all shadow-2xl shadow-[#355872]/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                {progress || "Converting..."}
              </span>
            ) : (
              <>
                <Download className="w-7 h-7" /> Convert to Word
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
