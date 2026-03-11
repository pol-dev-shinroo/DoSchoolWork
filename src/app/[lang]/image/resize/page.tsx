import type { Metadata } from "next";
import ImageResizeClient from "./ImageResizeClient";
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
        el: "https://hispdf.com/el/image/resize",
        km: "https://hispdf.com/km/image/resize",
        id: "https://hispdf.com/id/image/resize",
      },
    },
  };
}

export default function ResizePage() {
  return <ImageResizeClient />;
}
