"use client";

import React from "react";
import { FileSearch, Trash2, Download, Loader2, FileDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PreviewChunk } from "@/app/[lang]/convert/ocr-pdf/OCRPdfClient";

interface OcrPdfWorkspaceProps {
  fileName: string;
  isProcessing: boolean;
  progressStatus: string;
  previews: PreviewChunk[];
  onClear: () => void;
  onProcess: () => void;
}

export default function OcrPdfWorkspace({
  fileName,
  isProcessing,
  progressStatus,
  previews,
  onClear,
  onProcess,
}: OcrPdfWorkspaceProps) {
  const { locale } = useLanguage();

  // FIX: Stripping out the .pdf extension from the original fileName for clean mapping
  const cleanBaseName = fileName.replace(/\.pdf$/i, "");

  const i18n = {
    en: {
      noteLabel: "Note:",
      noteDesc:
        "Text recognition is intensive and runs entirely on your device's processor to protect your privacy.",
      processBtn: "Make Searchable",
      defaultProgress: "Processing...",
      milestoneTitle: "Milestone Previews",
      milestoneDesc:
        "You can preview and download your file every 20 pages. For large files, this also prevents your browser from crashing.",
    },
    ko: {
      noteLabel: "참고:",
      noteDesc:
        "텍스트 인식은 리소스 집약적이며 개인정보 보호를 위해 사용자 기기에서 완전히 실행됩니다.",
      processBtn: "검색 가능하게 만들기",
      defaultProgress: "처리 중...",
      milestoneTitle: "중간 미리보기",
      milestoneDesc:
        "20페이지마다 파일을 미리 보고 다운로드할 수 있습니다. 대용량 파일의 경우 브라우저 충돌을 방지하기도 합니다.",
    },
    zh: {
      noteLabel: "注意:",
      noteDesc: "文本识别计算量大，完全在您的设备处理器上运行以保护您的隐私。",
      processBtn: "使其可搜索",
      defaultProgress: "处理中...",
      milestoneTitle: "里程碑预览",
      milestoneDesc:
        "您可以每20页预览并下载您的文件。对于大文件，这也防止了您的浏览器崩溃。",
    },
    de: {
      noteLabel: "Hinweis:",
      noteDesc:
        "Die Texterkennung ist rechenintensiv und läuft zum Schutz Ihrer Privatsphäre vollständig auf Ihrem Gerät.",
      processBtn: "Durchsuchbar machen",
      defaultProgress: "Wird bearbeitet...",
      milestoneTitle: "Meilenstein-Vorschau",
      milestoneDesc:
        "Sie können Ihre Datei alle 20 Seiten in der Vorschau anzeigen und herunterladen. Bei großen Dateien verhindert dies auch einen Browser-Absturz.",
    },
    ru: {
      noteLabel: "Примечание:",
      noteDesc:
        "Распознавание текста ресурсоемко и выполняется полностью на вашем устройстве для защиты вашей конфиденциальности.",
      processBtn: "Сделать доступным для поиска",
      defaultProgress: "Обработка...",
      milestoneTitle: "Промежуточный просмотр",
      milestoneDesc:
        "Вы можете предварительно просматривать и скачивать файл каждые 20 страниц. Для больших файлов это также предотвращает сбой браузера.",
    },
    el: {
      noteLabel: "Σημείωση:",
      noteDesc:
        "Η αναγνώριση κειμένου είναι απαιτητική και εκτελείται εξ ολοκλήρου στον επεξεργαστή της συσκευής σας για την προστασία του απορρήτου σας.",
      processBtn: "Κάντε το Αναζητήσιμο",
      defaultProgress: "Επεξεργασία...",
      milestoneTitle: "Προεπισκοπήσεις Ορόσημων",
      milestoneDesc:
        "Μπορείτε να κάνετε προεπισκόπηση και λήψη του αρχείου σας κάθε 20 σελίδες. Για μεγάλα αρχεία, αυτό αποτρέπει επίσης τη διακοπή λειτουργίας του προγράμματος περιήγησής σας.",
    },
    km: {
      noteLabel: "ចំណាំ៖",
      noteDesc:
        "ការទទួលស្គាល់អត្ថបទត្រូវការធនធានច្រើន ហើយដំណើរការទាំងស្រុងនៅលើឧបករណ៍របស់អ្នក ដើម្បីការពារឯកជនភាពរបស់អ្នក។",
      processBtn: "ធ្វើឱ្យអាចស្វែងរកបាន",
      defaultProgress: "កំពុងដំណើរការ...",
      milestoneTitle: "ការមើលជាមុនតាមដំណាក់កាល",
      milestoneDesc:
        "អ្នកអាចមើលជាមុន និងទាញយកឯកសាររបស់អ្នករៀងរាល់ 20 ទំព័រម្តង។ សម្រាប់ឯកសារធំៗ នេះក៏ជួយការពារកម្មវិធីរុករករបស់អ្នកពីការគាំងផងដែរ។",
    },
    id: {
      noteLabel: "Catatan:",
      noteDesc:
        "Pengenalan teks membutuhkan banyak sumber daya dan berjalan sepenuhnya di prosesor perangkat Anda untuk melindungi privasi Anda.",
      processBtn: "Buat Dapat Dicari",
      defaultProgress: "Memproses...",
      milestoneTitle: "Pratinjau Pencapaian",
      milestoneDesc:
        "Anda dapat mempratinjau dan mengunduh file Anda setiap 20 halaman. Untuk file besar, ini juga mencegah peramban Anda mogok.",
    },
  };

  const text = i18n[locale] || i18n.en;

  return (
    <div className="flex flex-col gap-8 items-center py-2">
      {/* Header Bar */}
      <div className="inline-flex items-center gap-3 bg-[#F7F8F0] px-6 py-3 rounded-2xl border-2 border-[#355872]/10 w-full justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileSearch className="w-5 h-5 text-[#355872] flex-shrink-0" />
          <p
            className="font-black text-[#355872] truncate max-w-[240px]"
            title={fileName}
          >
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

      {/* Milestone Previews Section */}
      {previews.length > 0 && (
        <div className="w-full mt-2 border-t-2 border-dashed border-[#355872]/10 pt-6">
          <h3 className="text-sm font-black text-[#355872] mb-1">
            {text.milestoneTitle}
          </h3>
          <p className="text-[10px] font-bold text-[#7AAACE] mb-4 leading-tight">
            {text.milestoneDesc}
          </p>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#355872]/20 scrollbar-track-transparent">
            {previews.map((chunk, idx) => (
              <a
                key={idx}
                href={chunk.url}
                // FIX: Download will now end perfectly in .pdf
                download={`Searchable_${cleanBaseName}_(${chunk.title}).pdf`}
                className="flex items-center justify-between p-3 bg-white border-2 border-[#355872]/10 rounded-xl hover:border-[#9CD5FF] hover:bg-[#F7F8F0]/50 transition-all group"
              >
                <span className="text-xs font-black text-[#355872] group-hover:text-[#7AAACE] transition-colors">
                  {chunk.title.replace("_", " ")}
                </span>
                <FileDown className="w-4 h-4 text-[#7AAACE]" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
