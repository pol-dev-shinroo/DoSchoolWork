"use client";

import React from "react";
import { FileSearch, Trash2, Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface OcrPdfWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  onClear: () => void;
  onProcess: () => void;
}

export default function OcrPdfWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  onClear,
  onProcess,
}: OcrPdfWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      noteLabel: "Note:",
      noteDesc:
        "Text recognition is intensive and runs entirely on your device's processor to protect your privacy.",
      processBtn: "Make Searchable",
      defaultProgress: "Processing...",
    },
    ko: {
      noteLabel: "참고:",
      noteDesc:
        "텍스트 인식은 리소스 집약적이며 개인정보 보호를 위해 사용자 기기에서 완전히 실행됩니다.",
      processBtn: "검색 가능하게 만들기",
      defaultProgress: "처리 중...",
    },
    zh: {
      noteLabel: "注意:",
      noteDesc: "文本识别计算量大，完全在您的设备处理器上运行以保护您的隐私。",
      processBtn: "使其可搜索",
      defaultProgress: "处理中...",
    },
    de: {
      noteLabel: "Hinweis:",
      noteDesc:
        "Die Texterkennung ist rechenintensiv und läuft zum Schutz Ihrer Privatsphäre vollständig auf Ihrem Gerät.",
      processBtn: "Durchsuchbar machen",
      defaultProgress: "Wird bearbeitet...",
    },
    ru: {
      noteLabel: "Примечание:",
      noteDesc:
        "Распознавание текста ресурсоемко и выполняется полностью на вашем устройстве для защиты вашей конфиденциальности.",
      processBtn: "Сделать доступным для поиска",
      defaultProgress: "Обработка...",
    },
    el: {
      noteLabel: "Σημείωση:",
      noteDesc:
        "Η αναγνώριση κειμένου είναι απαιτητική και εκτελείται εξ ολοκλήρου στον επεξεργαστή της συσκευής σας για την προστασία του απορρήτου σας.",
      processBtn: "Κάντε το Αναζητήσιμο",
      defaultProgress: "Επεξεργασία...",
    },
    km: {
      noteLabel: "ចំណាំ៖",
      noteDesc:
        "ការទទួលស្គាល់អត្ថបទត្រូវការធនធានច្រើន ហើយដំណើរការទាំងស្រុងនៅលើឧបករណ៍របស់អ្នក ដើម្បីការពារឯកជនភាពរបស់អ្នក។",
      processBtn: "ធ្វើឱ្យអាចស្វែងរកបាន",
      defaultProgress: "កំពុងដំណើរការ...",
    },
    id: {
      noteLabel: "Catatan:",
      noteDesc:
        "Pengenalan teks membutuhkan banyak sumber daya dan berjalan sepenuhnya di prosesor perangkat Anda untuk melindungi privasi Anda.",
      processBtn: "Buat Dapat Dicari",
      defaultProgress: "Memproses...",
    },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8 items-center py-2">
      {/* Header Bar */}
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileSearch className="w-5 h-5 text-[#355872] flex-shrink-0" />
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
        onClick={onProcess}
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
            <Download className="w-7 h-7" /> {text.processBtn}
          </>
        )}
      </button>
    </div>
  );
}
