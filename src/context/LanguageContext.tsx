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
  // Fix: Initialize state directly from localStorage to avoid cascading renders
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language-pref") as Locale;
      return saved || "en";
    }
    return "en";
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("language-pref", newLocale);
    }
  };

  // Sync the HTML lang attribute for SEO and Accessibility
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = locale === "en" ? en : ko;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
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
