"use client";

import React from "react";
import { FileImage } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageToPdfUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageToPdfUpload({
  onFileChange,
}: ImageToPdfUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { title: "Image to PDF", desc: "Select images to combine" },
    ko: { title: "이미지 PDF 변환", desc: "결합할 이미지 선택" },
    zh: { title: "图像转 PDF", desc: "选择要合并的图像" },
    de: { title: "Bild zu PDF", desc: "Wählen Sie Bilder zum Kombinieren aus" },
    ru: {
      title: "Изображение в PDF",
      desc: "Выберите изображения для объединения",
    },
    el: { title: "Εικόνα σε PDF", desc: "Επιλέξτε εικόνες για συνδυασμό" },
    km: { title: "រូបភាពទៅ PDF", desc: "ជ្រើសរើសរូបភាពដើម្បីបញ្ចូលចូលគ្នា" },
    id: { title: "Gambar ke PDF", desc: "Pilih gambar untuk digabungkan" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <FileImage className="w-12 h-12 text-[#355872]" />
      </div>
      <h2 className="font-black text-2xl text-[#355872]">{text.title}</h2>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        {text.desc}
      </p>
    </div>
  );
}
