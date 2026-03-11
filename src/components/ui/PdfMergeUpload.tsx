"use client";

import React from "react";
import { FileStack } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PdfMergeUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PdfMergeUpload({ onFileChange }: PdfMergeUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { title: "Merge Documents", desc: "Select files to combine" },
    ko: { title: "문서 병합", desc: "결합할 파일 선택" },
    zh: { title: "合并文档", desc: "选择要合并的文件" },
    de: {
      title: "Dokumente zusammenfügen",
      desc: "Wählen Sie Dateien zum Kombinieren",
    },
    ru: {
      title: "Объединить документы",
      desc: "Выберите файлы для объединения",
    },
    el: { title: "Συγχώνευση Εγγράφων", desc: "Επιλέξτε αρχεία για συνδυασμό" },
    km: {
      title: "បញ្ចូលឯកសារចូលគ្នា",
      desc: "ជ្រើសរើសឯកសារដើម្បីបញ្ចូលចូលគ្នា",
    },
    id: { title: "Gabungkan Dokumen", desc: "Pilih file untuk digabungkan" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <FileStack className="w-12 h-12 text-[#355872]" />
      </div>
      <p className="font-black text-2xl text-[#355872]">{text.title}</p>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        {text.desc}
      </p>
    </div>
  );
}
