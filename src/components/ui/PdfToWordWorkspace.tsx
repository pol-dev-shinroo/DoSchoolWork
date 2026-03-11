"use client";

import React from "react";
import { FileText, Trash2, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PdfToWordWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  onClear: () => void;
  onConvert: () => void;
}

export default function PdfToWordWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  onClear,
  onConvert,
}: PdfToWordWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      noteLabel: "Note:",
      noteDesc:
        "This tool extracts text and paragraphs locally. Complex tables or images may not be preserved.",
      processBtn: "Convert to Word",
      defaultProgress: "Converting...",
    },
    ko: {
      noteLabel: "참고:",
      noteDesc:
        "이 도구는 기기에서 로컬로 텍스트와 단락을 추출합니다. 복잡한 표나 이미지는 유지되지 않을 수 있습니다.",
      processBtn: "Word로 변환",
      defaultProgress: "변환 중...",
    },
    zh: {
      noteLabel: "注意:",
      noteDesc: "此工具在本地提取文本和段落。可能无法保留复杂的表格或图像。",
      processBtn: "转换为 Word",
      defaultProgress: "转换中...",
    },
    de: {
      noteLabel: "Hinweis:",
      noteDesc:
        "Dieses Tool extrahiert Text und Absätze lokal. Komplexe Tabellen oder Bilder bleiben möglicherweise nicht erhalten.",
      processBtn: "In Word konvertieren",
      defaultProgress: "Konvertieren...",
    },
    ru: {
      noteLabel: "Примечание:",
      noteDesc:
        "Этот инструмент извлекает текст и абзацы локально. Сложные таблицы или изображения могут не сохраниться.",
      processBtn: "Конвертировать в Word",
      defaultProgress: "Конвертация...",
    },
    el: {
      noteLabel: "Σημείωση:",
      noteDesc:
        "Αυτό το εργαλείο εξάγει κείμενο και παραγράφους τοπικά. Πολύπλοκοι πίνακες ή εικόνες ενδέχεται να μην διατηρηθούν.",
      processBtn: "Μετατροπή σε Word",
      defaultProgress: "Μετατροπή...",
    },
    km: {
      noteLabel: "ចំណាំ៖",
      noteDesc:
        "ឧបករណ៍នេះទាញយកអត្ថបទ និងកថាខណ្ឌនៅក្នុងម៉ាស៊ីន។ តារាង ឬរូបភាពស្មុគស្មាញអាចនឹងមិនត្រូវបានរក្សាទុកទេ។",
      processBtn: "បម្លែងទៅជា Word",
      defaultProgress: "កំពុងបម្លែង...",
    },
    id: {
      noteLabel: "Catatan:",
      noteDesc:
        "Alat ini mengekstrak teks dan paragraf secara lokal. Tabel atau gambar yang kompleks mungkin tidak dipertahankan.",
      processBtn: "Konversi ke Word",
      defaultProgress: "Mengonversi...",
    },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8 items-center py-2">
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className="w-5 h-5 text-[#355872] flex-shrink-0" />
          <p className="font-black text-[#355872] truncate max-w-[240px]">
            {fileName}
          </p>
        </div>
        <button
          onClick={onClear}
          disabled={isProcessing}
          className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-xl text-center">
        <p className="text-xs font-bold text-[#355872]/80">
          <span className="font-black text-[#355872] mr-1">
            {text.noteLabel}
          </span>
          {text.noteDesc}
        </p>
      </div>

      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all shadow-2xl shadow-[#355872]/20 disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            {progressStatus || text.defaultProgress}
          </span>
        ) : (
          <>
            <Download className="w-7 h-7" /> {text.processBtn}
          </>
        )}
      </button>
    </div>
  );
}
