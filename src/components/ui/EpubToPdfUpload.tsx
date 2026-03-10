import React from "react";
import { BookUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EpubToPdfUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EpubToPdfUpload({
  onFileChange,
}: EpubToPdfUploadProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#355872]/30 rounded-3xl bg-[#F7F8F0]/30 hover:bg-[#F7F8F0]/80 transition-all duration-300 group relative">
      <input
        type="file"
        accept=".epub"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
        <BookUp className="w-10 h-10 text-[#355872] group-hover:text-[#7AAACE] transition-colors" />
      </div>

      <h3 className="text-xl font-black text-[#355872] mb-2">
        {t.epubToPdf.workspaceTitle}
      </h3>
      <p className="text-sm font-bold text-[#7AAACE] text-center max-w-xs mb-6">
        {t.epubToPdf.workspaceDesc}
      </p>

      <button className="px-6 py-3 bg-[#355872] text-[#F7F8F0] text-sm font-black uppercase tracking-wider rounded-xl hover:bg-[#2a465a] hover:shadow-lg hover:shadow-[#355872]/20 transition-all active:scale-95">
        {t.epubToPdf.workspaceButton}
      </button>
    </div>
  );
}
