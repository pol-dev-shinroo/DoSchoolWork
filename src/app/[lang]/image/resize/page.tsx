import type { Metadata } from "next";
import ImageResizeClient from "./ImageResizeClient";
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
    title: `${t.imageResize.title} | HisPDF`,
    description: t.imageResize.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/resize`,
      languages: {
        en: "https://hispdf.com/en/image/resize",
        ko: "https://hispdf.com/ko/image/resize",
        zh: "https://hispdf.com/zh/image/resize",
        de: "https://hispdf.com/de/image/resize",
        ru: "https://hispdf.com/ru/image/resize",
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

export default function ResizePage() {
  return <ImageResizeClient />;
}
