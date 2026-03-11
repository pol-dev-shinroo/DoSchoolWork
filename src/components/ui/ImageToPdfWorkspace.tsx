"use client";

import React from "react";
import {
  Download,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface ImageToPdfWorkspaceProps {
  images: ImageItem[];
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onConvert: () => void;
}

export default function ImageToPdfWorkspace({
  images,
  isProcessing,
  onFileChange,
  onRemove,
  onMove,
  onConvert,
}: ImageToPdfWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { addMore: "Add More", downloadBtn: "Download PDF" },
    ko: { addMore: "추가하기", downloadBtn: "PDF 다운로드" },
    zh: { addMore: "添加更多", downloadBtn: "下载 PDF" },
    de: { addMore: "Mehr hinzufügen", downloadBtn: "PDF herunterladen" },
    ru: { addMore: "Добавить еще", downloadBtn: "Скачать PDF" },
    el: { addMore: "Προσθήκη Περισσότερων", downloadBtn: "Λήψη PDF" },
    km: { addMore: "បន្ថែមទៀត", downloadBtn: "ទាញយក PDF" },
    id: { addMore: "Tambah Lagi", downloadBtn: "Unduh PDF" },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((item, index) => (
          <div
            key={item.id}
            className="relative group bg-[#F7F8F0] p-3 rounded-2xl border-2 border-[#355872]/5 hover:border-[#355872]/20 transition-all flex flex-col gap-3"
          >
            {/* Image Preview */}
            <div className="h-32 w-full bg-white rounded-xl overflow-hidden relative flex items-center justify-center">
              <img
                src={item.preview}
                alt="preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-1">
              <div className="flex gap-1">
                <button
                  onClick={() => onMove(index, "up")}
                  disabled={index === 0}
                  className="p-1.5 bg-white rounded-lg text-[#355872] disabled:opacity-30 hover:bg-[#9CD5FF]/20 transition-colors"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onMove(index, "down")}
                  disabled={index === images.length - 1}
                  className="p-1.5 bg-white rounded-lg text-[#355872] disabled:opacity-30 hover:bg-[#9CD5FF]/20 transition-colors"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Page Number Badge */}
            <div className="absolute top-2 right-2 bg-[#355872] text-[#F7F8F0] text-[10px] font-black px-2 py-1 rounded-lg shadow-md">
              PG {index + 1}
            </div>
          </div>
        ))}

        {/* Add More Button */}
        <div className="relative group min-h-[160px] border-4 border-dashed border-[#355872]/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#9CD5FF]/5 hover:border-[#355872]/20 transition-all">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <Plus className="w-8 h-8 text-[#355872]/40 group-hover:text-[#355872]/60 transition-colors" />
          <span className="text-xs font-black text-[#355872]/40 uppercase tracking-widest group-hover:text-[#355872]/60 transition-colors">
            {text.addMore}
          </span>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-3 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] transition-all disabled:opacity-50 shadow-xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Download className="w-6 h-6" /> {text.downloadBtn}
          </>
        )}
      </button>
    </div>
  );
}
