"use client";

import React from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Image as ImageIcon, Trash2, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ImageCropWorkspaceProps {
  imageSrc: string;
  fileName: string;
  crop: Crop | undefined;
  imageRef: React.RefObject<HTMLImageElement | null>;
  isProcessing: boolean;
  isValidCrop: boolean;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  onClear: () => void;
  onDownload: () => void;
}

export default function ImageCropWorkspace({
  imageSrc,
  fileName,
  crop,
  imageRef,
  isProcessing,
  isValidCrop,
  setCrop,
  setCompletedCrop,
  onClear,
  onDownload,
}: ImageCropWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: { processBtn: "Crop & Download", defaultProgress: "Slicing image..." },
    ko: {
      processBtn: "자르고 다운로드",
      defaultProgress: "이미지 자르는 중...",
    },
    zh: { processBtn: "裁剪并下载", defaultProgress: "正在裁剪图像..." },
    de: {
      processBtn: "Zuschneiden & Herunterladen",
      defaultProgress: "Bild wird zugeschnitten...",
    },
    ru: {
      processBtn: "Обрезать и скачать",
      defaultProgress: "Нарезка изображения...",
    },
    el: {
      processBtn: "Περικοπή & Λήψη",
      defaultProgress: "Γίνεται περικοπή...",
    },
    km: { processBtn: "កាត់ និងទាញយក", defaultProgress: "កំពុងកាត់រូបភាព..." },
    id: { processBtn: "Potong & Unduh", defaultProgress: "Memotong gambar..." },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8 items-center">
      {/* Header Bar */}
      <div className="flex items-center gap-2 bg-[#F7F8F0] px-4 py-2 rounded-xl border border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <ImageIcon className="w-4 h-4 text-[#355872] flex-shrink-0" />
          <span className="font-bold text-[#355872] text-sm truncate">
            {fileName}
          </span>
        </div>
        <button
          onClick={onClear}
          className="ml-4 text-[#7AAACE] hover:text-red-500 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Crop Area */}
      <div className="bg-[#F7F8F0]/50 p-2 rounded-2xl border-2 border-[#355872]/5 w-full overflow-hidden flex justify-center items-center">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-[500px]"
        >
          <img
            ref={imageRef}
            alt="Crop me"
            src={imageSrc}
            className="max-w-full max-h-[500px] object-contain shadow-lg rounded-lg"
          />
        </ReactCrop>
      </div>

      {/* Action Button */}
      <button
        onClick={onDownload}
        disabled={isProcessing || !isValidCrop}
        className="w-full bg-[#355872] text-[#F7F8F0] px-6 py-5 rounded-2xl font-black text-lg hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#355872]/20 disabled:opacity-30 disabled:grayscale"
      >
        {isProcessing ? (
          <span>{text.defaultProgress}</span>
        ) : (
          <>
            <Download className="w-6 h-6" /> {text.processBtn}
          </>
        )}
      </button>
    </div>
  );
}
