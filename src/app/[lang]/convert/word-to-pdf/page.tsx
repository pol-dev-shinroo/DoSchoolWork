import type { Metadata } from "next";
import WordToPdfClient from "./WordToPdfClient";
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
    title: `${t.wordToPdf.title} | HisPDF`,
    description: t.wordToPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/word-to-pdf`,
      languages: {
        en: "https://hispdf.com/en/convert/word-to-pdf",
        ko: "https://hispdf.com/ko/convert/word-to-pdf",
        zh: "https://hispdf.com/zh/convert/word-to-pdf",
        de: "https://hispdf.com/de/convert/word-to-pdf",
        ru: "https://hispdf.com/ru/convert/word-to-pdf",
        el: "https://hispdf.com/el/convert/word-to-pdf",
        km: "https://hispdf.com/km/convert/word-to-pdf",
        id: "https://hispdf.com/id/convert/word-to-pdf",
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

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
