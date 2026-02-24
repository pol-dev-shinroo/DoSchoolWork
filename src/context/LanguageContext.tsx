"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
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
  // Always start in English. No localStorage, no hydration errors.
  const [locale, setLocale] = useState<Locale>("en");

  // Simply update the HTML lang attribute for screen readers/SEO
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // useMemo ensures React smoothly pushes updates to all components when language changes
  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: locale === "en" ? en : ko,
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
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
