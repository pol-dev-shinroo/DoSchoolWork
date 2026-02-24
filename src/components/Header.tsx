"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSheet from "./ui/LanguageSheet";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { locale, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#F7F8F0]/80 backdrop-blur-md z-50 border-b border-[#355872]/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#355872] rounded-xl flex items-center justify-center">
            <span className="text-[#F7F8F0] font-black text-xl italic">D</span>
          </div>
          <h1 className="text-2xl font-black text-[#355872] tracking-tighter">
            doschoolwork
          </h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="text-xs font-black text-[#355872] hover:text-[#7AAACE] transition-colors uppercase tracking-widest px-2">
            Log In
          </button>
          <button className="hidden sm:block bg-[#355872] text-[#F7F8F0] px-5 py-2.5 rounded-xl font-black text-xs hover:bg-[#7AAACE] transition-colors shadow-md shadow-[#355872]/20 uppercase tracking-widest">
            Sign Up
          </button>

          <div className="w-px h-4 bg-[#355872]/20 hidden sm:block"></div>

          {/* Updated Language Button */}
          <button
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#355872]/70 hover:text-[#355872] hover:bg-white/50 transition-all font-black text-xs"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">
              {locale === "en" ? "ENG 🇺🇸" : "KOR 🇰🇷"}
            </span>
          </button>
        </div>
      </div>

      {/* Language Selection Drawer */}
      <LanguageSheet isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </header>
  );
}
