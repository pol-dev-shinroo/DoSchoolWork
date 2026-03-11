"use client";

import React from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Image as ImageIcon,
  Trash2,
  Star,
  ZoomIn,
  Download,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Ratio {
  id: string;
  label: string;
  w: number;
  h: number;
  trendy: boolean;
}

interface ImageResizeWorkspaceProps {
  imageSrc: string;
  fileName: string;
  activeRatio: Ratio;
  ratios: Ratio[];
  crop: { x: number; y: number };
  zoom: number;
  isProcessing: boolean;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onRatioChange: (ratio: Ratio) => void;
  onClear: () => void;
  onDownload: () => void;
}

export default function ImageResizeWorkspace({
  imageSrc,
  fileName,
  activeRatio,
  ratios,
  crop,
  zoom,
  isProcessing,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onRatioChange,
  onClear,
  onDownload,
}: ImageResizeWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      trendy: "TRENDY",
      processBtn: "Export as",
      defaultProgress: "Processing...",
    },
    ko: {
      trendy: "인기",
      processBtn: "로 내보내기",
      defaultProgress: "처리 중...",
    },
    zh: { trendy: "热门", processBtn: "导出为", defaultProgress: "处理中..." },
    de: {
      trendy: "TREND",
      processBtn: "Exportieren als",
      defaultProgress: "Wird bearbeitet...",
    },
    ru: {
      trendy: "ТРЕНД",
      processBtn: "Экспорт как",
      defaultProgress: "Обработка...",
    },
    el: {
      trendy: "ΤΑΣΗ",
      processBtn: "Εξαγωγή ως",
      defaultProgress: "Επεξεργασία...",
    },
    km: {
      trendy: "ពេញនិយម",
      processBtn: "នាំចេញជា",
      defaultProgress: "កំពុងដំណើរការ...",
    },
    id: {
      trendy: "TREN",
      processBtn: "Ekspor sebagai",
      defaultProgress: "Memproses...",
    },
  };

  const ratioLabels: Record<string, Record<string, string>> = {
    "4:5": {
      en: "Social Portrait",
      ko: "소셜 포트레이트",
      zh: "社交肖像",
      de: "Soziales Porträt",
      ru: "Социальный портрет",
      el: "Κοινωνικό Πορτρέτο",
      km: "រូបភាពសង្គម",
      id: "Potret Sosial",
    },
    "1:1": {
      en: "Square / Profile",
      ko: "정사각형 / 프로필",
      zh: "正方形 / 个人资料",
      de: "Quadrat / Profil",
      ru: "Квадрат / Профиль",
      el: "Τετράγωνο / Προφίλ",
      km: "ការ៉េ / ប្រវត្តិរូប",
      id: "Persegi / Profil",
    },
    "16:9": {
      en: "Presentation",
      ko: "프레젠테이션",
      zh: "演示文稿",
      de: "Präsentation",
      ru: "Презентация",
      el: "Παρουσίαση",
      km: "បទបង្ហាញ",
      id: "Presentasi",
    },
    "9:16": {
      en: "Story / Reel",
      ko: "스토리 / 릴스",
      zh: "快拍 / 短视频",
      de: "Story / Reel",
      ru: "Истории / Reels",
      el: "Ιστορία / Reel",
      km: "រឿង / វីដេអូខ្លី",
      id: "Cerita / Reel",
    },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-6 items-center">
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

      {/* Interactive Cropper */}
      <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-[#F7F8F0]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={activeRatio.w / activeRatio.h}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
          showGrid={true}
        />
      </div>

      {/* Zoom Control */}
      <div className="w-full flex items-center gap-4 px-4 bg-[#F7F8F0]/50 p-4 rounded-2xl border border-[#355872]/5">
        <ZoomIn className="w-5 h-5 text-[#355872]/50" />
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full h-2 bg-[#355872]/20 rounded-lg appearance-none cursor-pointer accent-[#355872]"
        />
      </div>

      {/* Ratios Grid */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        {ratios.map((ratio) => {
          const localizedLabel = ratioLabels[ratio.id]?.[locale] || ratio.label;
          return (
            <button
              key={ratio.id}
              onClick={() => onRatioChange(ratio)}
              className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                activeRatio.id === ratio.id
                  ? "border-[#355872] bg-[#F7F8F0] shadow-md scale-105"
                  : "border-[#355872]/10 bg-white hover:border-[#9CD5FF]"
              }`}
            >
              {ratio.trendy && (
                <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm transform rotate-6 z-10">
                  <Star className="w-3 h-3 fill-yellow-900" /> {text.trendy}
                </div>
              )}
              <span
                className={`font-black text-lg ${activeRatio.id === ratio.id ? "text-[#355872]" : "text-[#7AAACE]"}`}
              >
                {ratio.id}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">
                {localizedLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Export Button */}
      <button
        onClick={onDownload}
        disabled={isProcessing}
        className="w-full bg-[#355872] text-[#F7F8F0] px-6 py-5 rounded-2xl font-black text-lg hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#355872]/20 disabled:opacity-30 disabled:grayscale mt-2"
      >
        {isProcessing ? (
          <span>{text.defaultProgress}</span>
        ) : (
          <>
            <Download className="w-6 h-6" />{" "}
            {locale === "ko"
              ? `${activeRatio.id}${text.processBtn}`
              : `${text.processBtn} ${activeRatio.id}`}
          </>
        )}
      </button>
    </div>
  );
}
