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
  BookUp,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function HomeClient() {
  const { t, locale } = useLanguage();

  const TOOLS = [
    {
      href: `/${locale}/convert/ocr-pdf`,
      icon: FileSearch,
      title: t.ocrPdf.title,
      description: t.ocrPdf.description,
    },
    {
      href: `/${locale}/convert/pdf-to-word`,
      icon: FileType,
      title: t.pdfToWord.title,
      description: t.pdfToWord.description,
    },
    {
      href: `/${locale}/convert/epub-to-pdf`,
      icon: BookUp,
      title: t.epubToPdf.title,
      description: t.epubToPdf.description,
    },
    {
      href: `/${locale}/pdf/split`, // <-- UPDATED URL HERE
      icon: Scissors,
      title: t.pdfCrop.title,
      description: t.pdfCrop.description,
    },
    {
      href: `/${locale}/pdf/merge`,
      icon: FileStack,
      title: t.pdfMerge.title,
      description: t.pdfMerge.description,
    },
    {
      href: `/${locale}/image/image-to-pdf`, // <-- UPDATED URL
      icon: FileImage,
      title: t.imageToPdf.title,
      description: t.imageToPdf.description,
    },
    {
      href: `/${locale}/image/rotate`,
      icon: ImageIcon,
      title: t.imageRotate.title,
      description: t.imageRotate.description,
    },
    {
      href: `/${locale}/image/crop`,
      icon: Crop,
      title: t.imageCrop.title,
      description: t.imageCrop.description,
    },
    {
      href: `/${locale}/image/resize`,
      icon: Maximize,
      title: t.imageResize.title,
      description: t.imageResize.description,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center pt-4 md:pt-6 mb-12 flex flex-col items-center">
        {/* Main Title - Prominent and Tight */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight text-[#355872]">
          {t.home.heroTitle}
        </h1>

        {/* HORIZONTAL CHECKLIST (BELOW TITLE) */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-[#355872]/80 font-bold max-w-4xl">
          <div className="flex items-center gap-2 bg-white/60 px-5 py-2 rounded-full border border-[#355872]/5 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-base md:text-lg">{t.home.featureFree}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 px-5 py-2 rounded-full border border-[#355872]/5 shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-base md:text-lg">
              {t.home.featureNoLogin}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/60 px-5 py-2 rounded-full border border-[#355872]/5 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-base md:text-lg">{t.home.featureLocal}</span>
          </div>
        </div>
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
