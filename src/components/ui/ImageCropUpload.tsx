"use client";

import React from "react";
import { Scissors } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageCropUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageCropUpload({
  onFileChange,
}: ImageCropUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { title: "Upload Image", desc: "JPG, PNG, WebP supported" },
    ko: { title: "이미지 업로드", desc: "JPG, PNG, WebP 지원" },
    zh: { title: "上传图像", desc: "支持 JPG、PNG、WebP" },
    de: { title: "Bild hochladen", desc: "JPG, PNG, WebP unterstützt" },
    ru: {
      title: "Загрузить изображение",
      desc: "Поддерживаются JPG, PNG, WebP",
    },
    el: { title: "Ανεβάστε Εικόνα", desc: "Υποστηρίζονται JPG, PNG, WebP" },
    km: { title: "ផ្ទុកឡើងរូបភាព", desc: "គាំទ្រ JPG, PNG, WebP" },
    id: { title: "Unggah Gambar", desc: "Mendukung JPG, PNG, WebP" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <Scissors className="w-12 h-12 text-[#355872]" />
      </div>
      <p className="font-black text-2xl text-[#355872]">{text.title}</p>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        {text.desc}
      </p>
    </div>
  );
}
