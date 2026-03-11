import type { Metadata } from "next";
import PdfToWordClient from "./PdfToWordClient";
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
    title: `${t.pdfToWord.title} | HisPDF`,
    description: t.pdfToWord.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/pdf-to-word`,
      languages: {
        en: "https://hispdf.com/en/convert/pdf-to-word",
        ko: "https://hispdf.com/ko/convert/pdf-to-word",
        zh: "https://hispdf.com/zh/convert/pdf-to-word",
        de: "https://hispdf.com/de/convert/pdf-to-word",
        ru: "https://hispdf.com/ru/convert/pdf-to-word",
        el: "https://hispdf.com/el/convert/pdf-to-word",
        km: "https://hispdf.com/km/convert/pdf-to-word",
        id: "https://hispdf.com/id/convert/pdf-to-word",
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
    { lang: "el" },
    { lang: "km" },
    { lang: "id" },
  ];
}

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
