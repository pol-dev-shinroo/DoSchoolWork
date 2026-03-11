import type { Metadata } from "next";
import ImageCropClient from "./ImageCropClient";
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
    title: `${t.imageCrop.title} | HisPDF`,
    description: t.imageCrop.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/crop`,
      languages: {
        en: "https://hispdf.com/en/image/crop",
        ko: "https://hispdf.com/ko/image/crop",
        zh: "https://hispdf.com/zh/image/crop",
        de: "https://hispdf.com/de/image/crop",
        ru: "https://hispdf.com/ru/image/crop",
        el: "https://hispdf.com/el/image/crop",
        km: "https://hispdf.com/km/image/crop",
        id: "https://hispdf.com/id/image/crop",
      },
    },
  };
}

export default function ImageCropPage() {
  return <ImageCropClient />;
}
