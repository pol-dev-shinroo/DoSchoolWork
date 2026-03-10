import type { Metadata } from "next";
import PdfCropClient from "./PdfCropClient";
import { en } from "@/dictionaries/en";
import { ko } from "@/dictionaries/ko";

type Locale = "en" | "ko";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const t = lang === "ko" ? ko : en;

  return {
    title: `${t.pdfCrop.title} | HisPDF`,
    description: t.pdfCrop.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/pdf/crop`,
      languages: {
        en: "https://hispdf.com/en/pdf/crop",
        ko: "https://hispdf.com/ko/pdf/crop",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function CropPage() {
  return <PdfCropClient />;
}
