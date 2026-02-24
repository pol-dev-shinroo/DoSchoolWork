"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Scissors,
  FileStack,
  Image as ImageIcon,
  Sparkles,
  Crop,
  Maximize,
  FileImage,
  FileText,
  FileType,
  FileSearch,
} from "lucide-react";

export default function HomeClient() {
  const { t } = useLanguage();

  // We define TOOLS inside the component so it can access the 't' translations dynamically
  const TOOLS = [
    {
      href: "/pdf/crop",
      icon: Scissors,
      title: t.pdfCrop.title,
      description: t.pdfCrop.description,
    },
    {
      href: "/pdf/merge",
      icon: FileStack,
      title: t.pdfMerge.title,
      description: t.pdfMerge.description,
    },
    {
      href: "/image/rotate",
      icon: ImageIcon,
      title: t.imageRotate.title,
      description: t.imageRotate.description,
    },
    {
      href: "/image/crop",
      icon: Crop,
      title: t.imageCrop.title,
      description: t.imageCrop.description,
    },
    {
      href: "/image/resize",
      icon: Maximize,
      title: t.imageResize.title,
      description: t.imageResize.description,
    },
    {
      href: "/convert/jpg-to-pdf",
      icon: FileImage,
      title: t.jpgToPdf.title,
      description: t.jpgToPdf.description,
    },
    {
      href: "/convert/word-to-pdf",
      icon: FileText,
      title: t.wordToPdf.title,
      description: t.wordToPdf.description,
    },
    {
      href: "/convert/pdf-to-word",
      icon: FileType,
      title: t.pdfToWord.title,
      description: t.pdfToWord.description,
    },
    {
      href: "/convert/ocr-pdf",
      icon: FileSearch,
      title: t.ocrPdf.title,
      description: t.ocrPdf.description,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-16 pt-8">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-[#355872]">
          {t.home.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-[#355872]/70 font-bold max-w-2xl mx-auto">
          {t.home.heroSubtitle1}
          <br className="hidden md:block" />
          {t.home.heroSubtitle2}
        </p>
      </section>

      {/* Feature Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-16">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Icon className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
              </div>
              <h2 className="text-2xl font-black text-[#355872] mb-3">
                {tool.title}
              </h2>
              <p className="text-sm font-bold text-[#7AAACE]">
                {tool.description}
              </p>
            </Link>
          );
        })}

        {/* Coming Soon Tile */}
        <div className="bg-[#F7F8F0]/50 border-2 border-dashed border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center opacity-60">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-[#355872]/40" />
          </div>
          <h2 className="text-xl font-black text-[#355872]/60 mb-2">
            {t.home.comingSoonTitle}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7AAACE]">
            {t.home.comingSoonDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
