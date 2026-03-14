"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface OcrPdfUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OcrPdfUpload({ onFileChange }: OcrPdfUploadProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      title: "Upload Scanned PDF",
      desc: "Maximum Privacy - Secure Cloud Processing",
    },
    ko: {
      title: "스캔한 PDF 업로드",
      desc: "최대 개인정보 보호 - 안전한 클라우드 처리",
    },
    zh: {
      title: "上传扫描的 PDF",
      desc: "最高隐私 - 安全的云端处理",
    },
    de: {
      title: "Gescannte PDF hochladen",
      desc: "Maximaler Datenschutz - Sichere Cloud-Verarbeitung",
    },
    ru: {
      title: "Загрузить отсканированный PDF",
      desc: "Максимальная конфиденциальность - Безопасная облачная обработка",
    },
    el: {
      title: "Ανεβάστε Σαρωμένο PDF",
      desc: "Μέγιστο Απόρρητο - Ασφαλής Επεξεργασία στο Cloud",
    },
    km: {
      title: "ផ្ទុកឡើង PDF ដែលបានស្កេន",
      desc: "ឯកជនភាពអតិបរមា - ដំណើរការលើ Cloud ប្រកបដោយសុវត្ថិភាព",
    },
    id: {
      title: "Unggah PDF Hasil Scan",
      desc: "Privasi Maksimal - Pemrosesan Cloud Aman",
    },
  };

  const text = i18n[locale as keyof typeof i18n] || i18n.en;

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
