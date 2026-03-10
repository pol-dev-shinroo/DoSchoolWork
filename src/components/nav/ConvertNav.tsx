"use client";

import Link from "next/link";
import { FileText, FileType, FileSearch, BookUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ConvertNav({ active }: { active: string }) {
  const { locale } = useLanguage();

  // Reordered: OCR PDF is now first!
  const links = [
    {
      id: "ocr-pdf",
      label: "OCR PDF",
      icon: FileSearch,
      href: `/${locale}/convert/ocr-pdf`,
    },
    {
      id: "pdf-to-word",
      label: "PDF TO WORD",
      icon: FileType,
      href: `/${locale}/convert/pdf-to-word`,
    },
    {
      id: "epub-to-pdf",
      label: "EPUB TO PDF",
      icon: BookUp,
      href: `/${locale}/convert/epub-to-pdf`,
    },
    // ==========================================
    // HIDDEN FOR MVP: Word to PDF
    // ==========================================
    /*
    {
      id: "word-to-pdf",
      label: "WORD TO PDF",
      icon: FileText,
      href: `/${locale}/convert/word-to-pdf`,
    },
    */
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm overflow-x-auto max-w-full scrollbar-hide">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap ${
            active === link.id
              ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20 scale-105"
              : "text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0]"
          }`}
        >
          <link.icon className="w-4 h-4" /> {link.label}
        </Link>
      ))}
    </div>
  );
}
