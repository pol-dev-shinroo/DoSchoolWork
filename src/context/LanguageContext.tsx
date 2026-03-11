"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";

// Import all 8 dictionaries
import { en, Dictionary } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";
import { zh } from "@/dictionaries/zh";
import { de } from "@/dictionaries/de";
import { ru } from "@/dictionaries/ru";
import { el } from "@/dictionaries/el";
import { km } from "@/dictionaries/km";
import { id } from "@/dictionaries/id";

export type Locale = "en" | "ko" | "zh" | "de" | "ru" | "el" | "km" | "id";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const validLocales: Locale[] = [
    "en",
    "ko",
    "zh",
    "de",
    "ru",
    "el",
    "km",
    "id",
  ];

  const urlSegment = pathname?.split("/")[1] as Locale;
  const locale: Locale = validLocales.includes(urlSegment) ? urlSegment : "en";

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (locale === newLocale) return;

      let newPath = pathname || "/";
      if (newPath.startsWith(`/${locale}`)) {
        newPath = newPath.replace(`/${locale}`, `/${newLocale}`);
      } else if (newPath === "/") {
        newPath = `/${newLocale}`;
      } else {
        newPath = `/${newLocale}${newPath}`;
      }

      router.push(newPath);
    },
    [locale, pathname, router],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const contextValue = useMemo(() => {
    let currentDictionary: Dictionary = en;
    if (locale === "ko") currentDictionary = ko;
    if (locale === "zh") currentDictionary = zh;
    if (locale === "de") currentDictionary = de;
    if (locale === "ru") currentDictionary = ru;
    if (locale === "el") currentDictionary = el;
    if (locale === "km") currentDictionary = km;
    if (locale === "id") currentDictionary = id;

    return {
      locale,
      setLocale,
      t: currentDictionary,
    };
  }, [locale, setLocale]);

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
