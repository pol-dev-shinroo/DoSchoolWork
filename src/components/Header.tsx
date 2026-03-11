"use client";

import { useState } from "react";
import { Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSheet from "./ui/LanguageSheet";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { locale, t } = useLanguage();

  // Dynamically map all 5 languages for the toggle button
  const displayMap: Record<string, { main: string; sub: string }> = {
    en: { main: "US", sub: "EN" },
    ko: { main: "KOR", sub: "KR" },
    zh: { main: "CHN", sub: "CN" },
    de: { main: "GER", sub: "DE" },
    ru: { main: "RUS", sub: "RU" },
    el: { main: "GRE", sub: "EL" },
    km: { main: "KHM", sub: "KM" },
    id: { main: "IDN", sub: "ID" }, // Bahasa Indonesia
  };

  const currentLangDisplay = displayMap[locale] || displayMap.en;

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#F7F8F0]/80 backdrop-blur-md z-50 border-b border-[#355872]/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* NEW STATIC HISPDF LOGO */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          {/* Creative, Geometric static 'H' Fold logo */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Base geometric shape */}
            <div className="absolute w-10 h-10 bg-[#355872] rounded-[10px]"></div>

            {/* Main H Body */}
            <span className="relative text-[#F7F8F0] font-black text-2xl tracking-tighter mt-0.5 z-10">
              H
            </span>

            {/* The Creative Fold Element */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-br-xl overflow-hidden"
              style={{
                background:
                  "conic-gradient(from 225deg at 100% 100%, #355872 90deg, #7AAACE 90deg 180deg, #FFFFFF 180deg)",
              }}
            >
              {/* Subtle inner shadow effect on fold */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Highlight Accent */}
            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#7AAACE] rounded-full shadow-md"></div>
          </div>

          <h1 className="text-2xl font-black text-[#355872] tracking-tighter">
            HisPDF
          </h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#355872]/5 rounded-xl border border-[#355872]/10">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider text-[#355872]/80 mt-0.5">
              {t.header.freeNoLogin}
            </span>
          </div>

          <div className="w-px h-5 bg-[#355872]/20 hidden sm:block"></div>

          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#355872]/70 hover:text-[#355872] hover:bg-white/50 transition-all font-black text-sm"
          >
            <Globe className="w-4.5 h-4.5" />
            <span className="uppercase flex items-center gap-1 mt-0.5">
              <span>{currentLangDisplay.main}</span>
              <span className="text-[10px] opacity-60 mt-0.5">
                {currentLangDisplay.sub}
              </span>
            </span>
          </button>
        </div>
      </div>

      <LanguageSheet isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </header>
  );
}
