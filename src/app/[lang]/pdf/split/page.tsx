import type { Metadata } from "next";
import PdfCropClient from "./PdfCropClient";
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
    title: `${t.pdfCrop.title} | HisPDF`,
    description: t.pdfCrop.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/pdf/crop`,
      languages: {
        en: "https://hispdf.com/en/pdf/crop",
        ko: "https://hispdf.com/ko/pdf/crop",
        zh: "https://hispdf.com/zh/pdf/crop",
        de: "https://hispdf.com/de/pdf/crop",
        ru: "https://hispdf.com/ru/pdf/crop",
        el: "https://hispdf.com/el/pdf/crop",
        km: "https://hispdf.com/km/pdf/crop",
        id: "https://hispdf.com/id/pdf/crop",
      },
    },
  };
}

export default function CropPage() {
  return <PdfCropClient />;
}
