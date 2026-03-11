import type { Metadata } from "next";
import PdfMergeClient from "./PdfMergeClient";
import { en } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";
import { zh } from "@/dictionaries/zh";
import { de } from "@/dictionaries/de";
import { ru } from "@/dictionaries/ru";
import { el } from "@/dictionaries/el";
import { km } from "@/dictionaries/km";
import { id } from "@/dictionaries/id";

type Locale = "en" | "ko" | "zh" | "de" | "ru" | "el" | "km" | "id";
const dictionaries = { en, ko, zh, de, ru, el, km, id };

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
        el: "https://hispdf.com/el/pdf/merge",
        km: "https://hispdf.com/km/pdf/merge",
        id: "https://hispdf.com/id/pdf/merge",
      },
    },
  };
}

export default function MergePage() {
  return <PdfMergeClient />;
}
