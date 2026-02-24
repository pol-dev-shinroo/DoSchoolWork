"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ko" : "en")}
      className="flex items-center gap-2 bg-white border border-[#355872]/10 px-3 py-1.5 rounded-xl font-black text-[10px] text-[#355872] hover:bg-[#F7F8F0] transition-all uppercase tracking-widest shadow-sm"
    >
      <span className={locale === "ko" ? "opacity-100" : "opacity-30"}>KO</span>
      <div className="w-px h-3 bg-[#355872]/20" />
      <span className={locale === "en" ? "opacity-100" : "opacity-30"}>EN</span>
    </button>
  );
}
