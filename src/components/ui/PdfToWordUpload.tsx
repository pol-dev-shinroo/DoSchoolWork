"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PdfToWordUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PdfToWordUpload({
  onFileChange,
}: PdfToWordUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { title: "Upload PDF", desc: "Extracts Text to .docx" },
    ko: { title: "PDF 업로드", desc: "텍스트를 .docx로 추출합니다" },
    zh: { title: "上传 PDF", desc: "提取文本到 .docx" },
    de: { title: "PDF hochladen", desc: "Extrahiert Text in .docx" },
    ru: { title: "Загрузить PDF", desc: "Извлекает текст в .docx" },
    el: { title: "Ανεβάστε PDF", desc: "Εξάγει κείμενο σε .docx" },
    km: { title: "ផ្ទុកឡើង PDF", desc: "ទាញយកអត្ថបទទៅជា .docx" },
    id: { title: "Unggah PDF", desc: "Mengekstrak Teks ke .docx" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <UploadCloud className="w-12 h-12 text-[#355872]" />
      </div>
      <p className="font-black text-2xl text-[#355872]">{text.title}</p>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        {text.desc}
      </p>
    </div>
  );
}
