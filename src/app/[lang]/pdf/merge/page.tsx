import type { Metadata } from "next";
import PdfMergeClient from "./PdfMergeClient";
import { en } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";
import { zh } from "@/dictionaries/zh";
import { de } from "@/dictionaries/de";
import { ru } from "@/dictionaries/ru";

type Locale = "en" | "ko" | "zh" | "de" | "ru";
const dictionaries = { en, ko, zh, de, ru };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const t = dictionaries[lang] || en;

  return {
    title: `${t.pdfMerge.title} | HisPDF`,
    description: t.pdfMerge.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/pdf/merge`,
      languages: {
        en: "https://hispdf.com/en/pdf/merge",
        ko: "https://hispdf.com/ko/pdf/merge",
        zh: "https://hispdf.com/zh/pdf/merge",
        de: "https://hispdf.com/de/pdf/merge",
        ru: "https://hispdf.com/ru/pdf/merge",
      },
    },
  };
}

export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ko" },
    { lang: "zh" },
    { lang: "de" },
    { lang: "ru" },
  ];
}

export default function MergePage() {
  return <PdfMergeClient />;
}
