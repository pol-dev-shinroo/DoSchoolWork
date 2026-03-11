"use client";

import { createPortal } from "react-dom";
import { X, Check, Globe } from "lucide-react";
import { useLanguage, Locale } from "@/context/LanguageContext";

export default function LanguageSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { locale, setLocale } = useLanguage();

  // Now fully expanded to 8 languages!
  const languages = [
    { code: "en", symbol: "US", label: "English", desc: "US English" },
    { code: "ko", symbol: "KR", label: "한국어", desc: "Korean" },
    { code: "zh", symbol: "CN", label: "中文", desc: "Chinese" },
    { code: "de", symbol: "DE", label: "Deutsch", desc: "German" },
    { code: "ru", symbol: "RU", label: "Русский", desc: "Russian" },
    { code: "el", symbol: "GR", label: "Ελληνικά", desc: "Greek" },
    { code: "km", symbol: "KH", label: "ខ្មែរ", desc: "Khmer" },
    { code: "id", symbol: "ID", label: "Bahasa Indonesia", desc: "Indonesian" },
  ];

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
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
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop: Fade In */}
        <div
          className="absolute inset-0 bg-[#F7F8F0]/40 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />

        {/* Drawer: Slide In */}
        <div className="relative w-full max-w-[340px] bg-white h-full shadow-2xl p-8 animate-slide-in flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#355872]/60" />
              <h2 className="text-xs font-black text-[#355872] uppercase tracking-widest">
                {locale === "en" ? "Language" : "언어 선택"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#F7F8F0] rounded-lg transition-all text-[#355872]/40 hover:text-[#355872]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Cards */}
          <div className="flex flex-col gap-3 overflow-y-auto pb-8">
            {languages.map((lang) => {
              const isActive = locale === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as Locale);
                    // Optional: Call onClose() here if you want the drawer to close immediately upon selection!
                  }}
                  className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group bg-white shrink-0 ${
                    isActive
                      ? "border-[#355872]/20 border-l-4 border-l-[#355872] shadow-sm"
                      : "border-transparent hover:border-[#355872]/10"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Minimalist Symbol (e.g., US, KR) */}
                    <span
                      className={`text-xl font-light transition-colors ${
                        isActive
                          ? "text-[#355872]"
                          : "text-[#355872]/40 group-hover:text-[#355872]/70"
                      }`}
                    >
                      {lang.symbol}
                    </span>

                    {/* Text Details */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-black text-sm transition-colors ${
                          isActive
                            ? "text-[#355872]"
                            : "text-[#355872]/60 group-hover:text-[#355872]"
                        }`}
                      >
                        {lang.label}
                      </span>
                      <span className="text-[9px] font-black text-[#355872]/30 uppercase tracking-[0.2em]">
                        {lang.desc}
                      </span>
                    </div>
                  </div>

                  {/* Checkmark */}
                  {isActive && (
                    <Check className="w-5 h-5 text-[#355872] stroke-[3]" />
                  )}
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
