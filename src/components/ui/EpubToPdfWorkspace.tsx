"use client";

import React from "react";
import { BookUp, Trash2, FileDown, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EpubToPdfWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  onClear: () => void;
  onConvert: () => Promise<void>;
}

export default function EpubToPdfWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  onClear,
  onConvert,
}: EpubToPdfWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      noteLabel: "Note:",
      noteDesc:
        "Book rendering and formatting run entirely on your device to protect your privacy.",
      processBtn: "Convert to PDF",
      defaultProgress: "Processing...",
    },
    ko: {
      noteLabel: "참고:",
      noteDesc:
        "개인정보 보호를 위해 책 렌더링 및 포맷팅은 전적으로 사용자 기기에서 실행됩니다.",
      processBtn: "PDF로 변환",
      defaultProgress: "처리 중...",
    },
    zh: {
      noteLabel: "注意:",
      noteDesc: "书籍渲染和格式化完全在您的设备上运行，以保护您的隐私。",
      processBtn: "转换为 PDF",
      defaultProgress: "处理中...",
    },
    de: {
      noteLabel: "Hinweis:",
      noteDesc:
        "Das Rendern und Formatieren von Büchern läuft zum Schutz Ihrer Privatsphäre vollständig auf Ihrem Gerät ab.",
      processBtn: "In PDF konvertieren",
      defaultProgress: "Wird bearbeitet...",
    },
    ru: {
      noteLabel: "Примечание:",
      noteDesc:
        "Рендеринг и форматирование книг выполняются полностью на вашем устройстве для защиты конфиденциальности.",
      processBtn: "Конвертировать в PDF",
      defaultProgress: "Обработка...",
    },
    el: {
      noteLabel: "Σημείωση:",
      noteDesc:
        "Η απόδοση και η μορφοποίηση του βιβλίου εκτελούνται εξ ολοκλήρου στη συσκευή σας για την προστασία του απορρήτου σας.",
      processBtn: "Μετατροπή σε PDF",
      defaultProgress: "Επεξεργασία...",
    },
    km: {
      noteLabel: "ចំណាំ៖",
      noteDesc:
        "ការរៀបចំ និងទម្រង់សៀវភៅដំណើរការទាំងស្រុងនៅលើឧបករណ៍របស់អ្នក ដើម្បីការពារឯកជនភាពរបស់អ្នក។",
      processBtn: "បម្លែងទៅជា PDF",
      defaultProgress: "កំពុងដំណើរការ...",
    },
    id: {
      noteLabel: "Catatan:",
      noteDesc:
        "Perenderan dan pemformatan buku berjalan sepenuhnya di perangkat Anda untuk melindungi privasi Anda.",
      processBtn: "Konversi ke PDF",
      defaultProgress: "Memproses...",
    },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8 items-center py-2">
      {/* Header Bar */}
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <BookUp className="w-5 h-5 text-[#355872] flex-shrink-0" />
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

      {/* Privacy Disclaimer */}
      <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-xl text-center">
        <p className="text-xs font-bold text-[#355872]/80">
          <span className="font-black text-[#355872] mr-1">
            {text.noteLabel}
          </span>
          {text.noteDesc}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onConvert}
        disabled={isProcessing}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] transition-all disabled:opacity-50 shadow-xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            {progressStatus || text.defaultProgress}
          </span>
        ) : (
          <>
            <FileDown className="w-7 h-7" /> {text.processBtn}
          </>
        )}
      </button>
    </div>
  );
}
