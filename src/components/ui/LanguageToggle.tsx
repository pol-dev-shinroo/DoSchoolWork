"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  onClick?: () => void;
}

export default function LanguageToggle({ onClick }: LanguageToggleProps) {
  const { locale } = useLanguage();

  const displayMap: Record<string, string> = {
    en: "US",
    ko: "KOR",
    zh: "CHN",
    de: "GER",
    ru: "RUS",
    el: "GRE",
    km: "KHM",
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white border border-[#355872]/10 px-3 py-1.5 rounded-xl font-black text-[10px] text-[#355872] hover:bg-[#F7F8F0] transition-all uppercase tracking-widest shadow-sm"
    >
      <Globe className="w-3.5 h-3.5 text-[#355872]/70" />
      <span className="mt-0.5">{displayMap[locale] || "US"}</span>
    </button>
  );
}
