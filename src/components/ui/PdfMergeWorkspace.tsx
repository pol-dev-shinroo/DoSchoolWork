"use client";

import React from "react";
import {
  Trash2,
  Plus,
  Download,
  GripVertical,
  Info,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FileItem {
  id: string;
  file: File;
  insertAfterPage?: string;
  pageCount: number;
}

interface PdfMergeWorkspaceProps {
  files: FileItem[];
  isProcessing: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (id: string) => void;
  onPageChange: (id: string, value: string) => void;
  onClearAll: () => void;
  onMerge: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

export default function PdfMergeWorkspace({
  files,
  isProcessing,
  onFileChange,
  onRemoveFile,
  onPageChange,
  onClearAll,
  onMerge,
  onReorder,
}: PdfMergeWorkspaceProps) {
  const { locale } = useLanguage();

  const i18n = {
    en: {
      title: "Merge List",
      docs: "Documents",
      howItWorks: "How merging works:",
      infoDesc:
        "The top file is your Base Document. To insert the second file directly inside it, type a page number. Leave it blank to add it to the end.",
      baseDoc: "Base Document",
      insertDoc: "Insert Document",
      pages: "Pages",
      sameName: "Same Name",
      insertAfter: "Insert after page:",
      addSecond: "Add Second File",
      mergeBtn: "Merge & Download",
      processing: "Merging...",
      clearAll: "Clear All",
      exceedsBase: "Exceeds base document length",
    },
    ko: {
      title: "병합 목록",
      docs: "문서",
      howItWorks: "병합 방법:",
      infoDesc:
        "첫 번째 파일은 기본 문서입니다. 두 번째 파일을 문서 중간에 삽입하려면 페이지 번호를 입력하세요. 비워두면 마지막에 추가됩니다.",
      baseDoc: "기본 문서",
      insertDoc: "삽입할 문서",
      pages: "페이지",
      sameName: "동일한 이름",
      insertAfter: "삽입 위치 (페이지 뒤):",
      addSecond: "두 번째 파일 추가",
      mergeBtn: "병합 및 다운로드",
      processing: "병합 중...",
      clearAll: "모두 지우기",
      exceedsBase: "기본 문서 길이를 초과합니다",
    },
    zh: {
      title: "合并列表",
      docs: "文档",
      howItWorks: "合并原理：",
      infoDesc:
        "顶部文件是您的基础文档。要将第二个文件直接插入其中，请输入页码。留空则添加到底部。",
      baseDoc: "基础文档",
      insertDoc: "插入文档",
      pages: "页",
      sameName: "同名",
      insertAfter: "插入在此页后：",
      addSecond: "添加第二个文件",
      mergeBtn: "合并并下载",
      processing: "合并中...",
      clearAll: "全部清除",
      exceedsBase: "超出基础文档长度",
    },
    de: {
      title: "Zusammenführungsliste",
      docs: "Dokumente",
      howItWorks: "So funktioniert das Zusammenführen:",
      infoDesc:
        "Die oberste Datei ist Ihr Basisdokument. Um die zweite Datei direkt darin einzufügen, geben Sie eine Seitenzahl ein. Lassen Sie das Feld leer, um sie am Ende hinzuzufügen.",
      baseDoc: "Basisdokument",
      insertDoc: "Dokument einfügen",
      pages: "Seiten",
      sameName: "Gleicher Name",
      insertAfter: "Einfügen nach Seite:",
      addSecond: "Zweite Datei hinzufügen",
      mergeBtn: "Zusammenfügen & Herunterladen",
      processing: "Zusammenführen...",
      clearAll: "Alles löschen",
      exceedsBase: "Überschreitet Basisdokumentlänge",
    },
    ru: {
      title: "Список объединения",
      docs: "Документы",
      howItWorks: "Как работает объединение:",
      infoDesc:
        "Верхний файл является базовым документом. Чтобы вставить второй файл непосредственно внутрь, введите номер страницы. Оставьте пустым, чтобы добавить в конец.",
      baseDoc: "Базовый документ",
      insertDoc: "Вставить документ",
      pages: "Стр.",
      sameName: "Одинаковое имя",
      insertAfter: "Вставить после страницы:",
      addSecond: "Добавить второй файл",
      mergeBtn: "Объединить и скачать",
      processing: "Объединение...",
      clearAll: "Очистить все",
      exceedsBase: "Превышает длину базового документа",
    },
  };

  const text = i18n[locale] || i18n.en;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(sourceIndex) && sourceIndex !== targetIndex) {
      onReorder(sourceIndex, targetIndex);
    }
  };

  const basePageCount = files[0]?.pageCount || 0;
  const insertInputValue = parseInt(files[1]?.insertAfterPage || "0", 10);

  const isInputInvalid =
    files.length === 2 &&
    files[1].insertAfterPage !== "" &&
    (insertInputValue > basePageCount || insertInputValue < 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-xl font-black text-[#355872]">{text.title}</h2>
        <p className="text-[10px] text-[#7AAACE] font-black uppercase tracking-[0.3em] mt-2">
          {files.length} / 2 {text.docs}
        </p>
      </div>

      {files.length === 2 && (
        <div className="bg-[#9CD5FF]/10 border border-[#9CD5FF]/30 p-4 rounded-2xl flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#355872] shrink-0 mt-0.5" />
          <div className="text-sm text-[#355872]">
            <p className="font-bold mb-1">{text.howItWorks}</p>
            <p className="opacity-80 leading-relaxed text-xs">
              {text.infoDesc}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {files.map((item, index) => {
          const isDuplicateName =
            files.filter((f) => f.file.name === item.file.name).length > 1;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-start gap-3 p-5 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing hover:shadow-xl hover:shadow-[#355872]/5 ${
                index === 0
                  ? "bg-[#355872] border-[#355872]"
                  : "bg-[#F7F8F0]/50 border-[#355872]/5 hover:bg-white hover:border-[#9CD5FF]/50"
              }`}
            >
              <div
                className={`mt-2 ${index === 0 ? "text-[#F7F8F0]/50" : "text-[#7AAACE]/40"}`}
              >
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-bold truncate text-sm ${index === 0 ? "text-white" : "text-[#355872]"}`}
                  >
                    {item.file.name}
                  </p>
                  {isDuplicateName && (
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${index === 0 ? "bg-white/20 text-white" : "bg-[#9CD5FF]/30 text-[#355872]"}`}
                    >
                      {text.sameName}
                    </span>
                  )}
                </div>

                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${index === 0 ? "text-[#9CD5FF]" : "text-[#7AAACE]"}`}
                >
                  {index === 0
                    ? `${text.baseDoc} • ${item.pageCount} ${text.pages}`
                    : `${text.insertDoc} • ${item.pageCount} ${text.pages}`}
                </p>

                {index > 0 && (
                  <div className="mt-3 flex flex-col gap-1">
                    <div
                      className={`flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border w-max shadow-sm transition-colors ${isInputInvalid ? "border-red-400" : "border-[#355872]/10"}`}
                      onDragStart={(e) => e.preventDefault()}
                      draggable="false"
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${isInputInvalid ? "text-red-500" : "text-[#355872]"}`}
                      >
                        {text.insertAfter}
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={basePageCount}
                        placeholder={`Max ${basePageCount}`}
                        value={item.insertAfterPage || ""}
                        onChange={(e) => onPageChange(item.id, e.target.value)}
                        className={`w-16 text-xs font-bold bg-transparent outline-none placeholder:text-[#7AAACE]/50 ${isInputInvalid ? "text-red-500" : "text-[#355872]"}`}
                      />
                    </div>
                    {isInputInvalid && (
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {text.exceedsBase} (
                        {basePageCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onRemoveFile(item.id)}
                className={`p-2 transition-colors mt-0.5 ${
                  index === 0
                    ? "text-[#F7F8F0]/50 hover:text-red-300"
                    : "text-[#7AAACE]/40 hover:text-red-500"
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}

        {files.length < 2 && (
          <div className="relative group mt-2">
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-4 border-dashed border-[#355872]/10 rounded-2xl py-8 flex items-center justify-center gap-3 text-[#7AAACE] group-hover:border-[#9CD5FF] group-hover:text-[#355872] group-hover:bg-[#9CD5FF]/5 transition-all cursor-pointer">
              <Plus className="w-6 h-6" />
              <span className="font-black text-sm uppercase tracking-widest">
                {text.addSecond}
              </span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onMerge}
        disabled={files.length !== 2 || isProcessing || isInputInvalid}
        className="w-full bg-[#355872] flex items-center justify-center gap-4 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] active:scale-[0.97] transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-[#355872]/20"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 border-4 border-[#F7F8F0]/30 border-t-[#F7F8F0] rounded-full animate-spin" />
            {text.processing}
          </span>
        ) : (
          <>
            <Download className="w-7 h-7" /> {text.mergeBtn}
          </>
        )}
      </button>

      <button
        onClick={onClearAll}
        className="text-xs font-black text-[#7AAACE] hover:text-red-500 transition-colors uppercase tracking-[0.3em] mx-auto"
      >
        {text.clearAll}
      </button>
    </div>
  );
}
