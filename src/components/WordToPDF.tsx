"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Download, Trash2, Loader2 } from "lucide-react";
import mammoth from "mammoth";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const generatePdf = async () => {
    if (!contentRef.current || !file) return;
    setIsProcessing(true);

    try {
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

  return (
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {!file ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <UploadCloud className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">Upload Word Doc</p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            Supports .docx files
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center py-2">
          <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileText className="w-5 h-5 text-[#355872] flex-shrink-0" />
              <p className="font-black text-[#355872] truncate max-w-[240px]">
                {file.name}
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setHtmlContent("");
              }}
              disabled={isProcessing}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={generatePdf}
            disabled={isProcessing}
            className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all shadow-2xl shadow-[#355872]/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Download className="w-7 h-7" /> Download PDF
              </>
            )}
          </button>

          {/* Hidden container for rendering */}
          <div className="hidden">
            <div
              ref={contentRef}
              className="pdf-content-wrapper text-black bg-white"
              style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
