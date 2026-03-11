"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PdfCropUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PdfCropUpload({ onFileChange }: PdfCropUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { title: "Upload PDF", desc: "100% Client-Side Processing" },
    ko: { title: "PDF 업로드", desc: "100% 클라이언트 측 처리" },
    zh: { title: "上传 PDF", desc: "100% 客户端处理" },
    de: { title: "PDF hochladen", desc: "100% clientseitige Verarbeitung" },
    ru: { title: "Загрузить PDF", desc: "100% обработка на стороне клиента" },
    el: {
      title: "Ανεβάστε PDF",
      desc: "100% Επεξεργασία στην πλευρά του πελάτη",
    },
    km: { title: "ផ្ទុកឡើង PDF", desc: "ដំណើរការក្នុងម៉ាស៊ីន 100%" },
    id: { title: "Unggah PDF", desc: "100% Diproses di Perangkat Klien" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        accept="application/pdf"
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
