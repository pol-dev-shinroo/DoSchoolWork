import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";
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
    title: `${t.imageToPdf.title} | HisPDF`,
    description: t.imageToPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/image-to-pdf`,
      languages: {
        en: "https://hispdf.com/en/image/image-to-pdf",
        ko: "https://hispdf.com/ko/image/image-to-pdf",
        zh: "https://hispdf.com/zh/image/image-to-pdf",
        de: "https://hispdf.com/de/image/image-to-pdf",
        ru: "https://hispdf.com/ru/image/image-to-pdf",
        el: "https://hispdf.com/el/image/image-to-pdf",
        km: "https://hispdf.com/km/image/image-to-pdf",
        id: "https://hispdf.com/id/image/image-to-pdf",
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

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
