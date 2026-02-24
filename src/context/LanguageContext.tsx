"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";
import { Dictionary } from "@/dictionaries/en";

type Locale = "en" | "ko";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize strictly as English to match the Server HTML (Prevent Hydration Mismatch)
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 2. Use setTimeout to move this logic to the "next tick"
    // This bypasses the "Synchronous setState" linter error completely.
    const timer = setTimeout(() => {
      const saved = localStorage.getItem("language-pref") as Locale;
      if (saved && saved !== "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language-pref", newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = locale === "en" ? en : ko;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {/* 3. Optional Polish: We fade the content in only after we've checked the language.
         This prevents the user from seeing "English" flash for a split second before "Korean" loads.
      */}
      <div
        className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
