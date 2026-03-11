import type { Metadata } from "next";
import ImageRotateClient from "./ImageRotateClient";
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
    title: `${t.imageRotate.title} | HisPDF`,
    description: t.imageRotate.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/rotate`,
      languages: {
        en: "https://hispdf.com/en/image/rotate",
        ko: "https://hispdf.com/ko/image/rotate",
        zh: "https://hispdf.com/zh/image/rotate",
        de: "https://hispdf.com/de/image/rotate",
        ru: "https://hispdf.com/ru/image/rotate",
        el: "https://hispdf.com/el/image/rotate",
        km: "https://hispdf.com/km/image/rotate",
        id: "https://hispdf.com/id/image/rotate",
      },
    },
  };
}

export default function RotatePage() {
  return <ImageRotateClient />;
}
