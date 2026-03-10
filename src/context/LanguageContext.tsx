"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback, // 1. Import useCallback
} from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current language directly from the URL
  const locale: Locale = pathname?.startsWith("/ko") ? "ko" : "en";

  // 2. Wrap setLocale in useCallback so the React Compiler can optimize it safely!
  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (locale === newLocale) return;

      // Swap out the language chunk in the URL
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
    [locale, pathname, router], // Dependencies for useCallback
  );

  // Update the HTML lang attribute for screen readers/SEO
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // 3. Add setLocale to the useMemo dependency array
  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t: locale === "en" ? en : ko,
    }),
    [locale, setLocale], // Dependencies match exactly what is inside the object!
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
