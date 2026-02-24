"use client";

import { createPortal } from "react-dom";
import { X, Check, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { locale, setLocale } = useLanguage();

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸", desc: "US English" },
    { code: "ko", label: "한국어", flag: "🇰🇷", desc: "Korean" },
  ];

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* 1. Define Keyframes locally to ensure animations work without plugins */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop: Fade In */}
        <div
          className="absolute inset-0 bg-[#F7F8F0]/20 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />

        {/* Drawer: Slide In */}
        <div className="relative w-full max-w-[340px] bg-white h-full shadow-[-10px_0_40px_rgba(53,88,114,0.08)] p-8 animate-slide-in flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#355872]/5 flex items-center justify-center">
                <Globe className="w-4 h-4 text-[#355872]" />
              </div>
              <h2 className="text-xs font-black text-[#355872] uppercase tracking-widest">
                {locale === "en" ? "Language" : "언어 선택"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F7F8F0] rounded-xl transition-all text-[#355872]/40 hover:text-[#355872]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Cards */}
          <div className="flex flex-col gap-3">
            {languages.map((lang) => {
              const isActive = locale === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as "en" | "ko");
                    // REMOVED onClose() so the sheet stays open
                  }}
                  className={`group relative w-full text-left p-4 rounded-2xl border transition-all duration-300 overflow-hidden bg-transparent ${
                    isActive
                      ? "border-[#355872]/20"
                      : "border-transparent hover:border-[#355872]/10"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#355872] rounded-r-full" />
                  )}

                  <div className="flex items-center justify-between ml-2">
                    <div className="flex items-center gap-4">
                      {/* Flag Container */}
                      <div
                        className={`w-12 h-12 flex items-center justify-center text-3xl transition-all duration-300 ${
                          isActive
                            ? "opacity-100 scale-105"
                            : "opacity-60 group-hover:opacity-100"
                        }`}
                      >
                        {lang.flag}
                      </div>

                      {/* Text Details */}
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`font-black text-sm transition-colors ${
                            isActive
                              ? "text-[#355872]"
                              : "text-[#355872]/60 group-hover:text-[#355872]"
                          }`}
                        >
                          {lang.label}
                        </span>
                        <span className="text-[10px] font-bold text-[#355872]/40 uppercase tracking-wider">
                          {lang.desc}
                        </span>
                      </div>
                    </div>

                    {/* Checkmark */}
                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center mr-2">
                        <Check className="w-5 h-5 text-[#355872] stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
