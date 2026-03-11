import type { Metadata } from "next";
import OCRPdfClient from "./OCRPdfClient";
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
    title: `${t.ocrPdf.title} | HisPDF`,
    description: t.ocrPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/ocr-pdf`,
      languages: {
        en: "https://hispdf.com/en/convert/ocr-pdf",
        ko: "https://hispdf.com/ko/convert/ocr-pdf",
        zh: "https://hispdf.com/zh/convert/ocr-pdf",
        de: "https://hispdf.com/de/convert/ocr-pdf",
        ru: "https://hispdf.com/ru/convert/ocr-pdf",
        el: "https://hispdf.com/el/convert/ocr-pdf",
        km: "https://hispdf.com/km/convert/ocr-pdf",
        id: "https://hispdf.com/id/convert/ocr-pdf",
      },
    },
  };
}

export default function OCRPdfPage() {
  return <OCRPdfClient />;
}
