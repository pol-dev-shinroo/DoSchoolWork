import type { Metadata } from "next";
import OCRPdfClient from "./OCRPdfClient";
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
    title: `${t.ocrPdf.title} | HisPDF`,
    description: t.ocrPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/ocr-pdf`,
      languages: {
        en: "https://hispdf.com/en/convert/ocr-pdf",
        ko: "https://hispdf.com/ko/convert/ocr-pdf",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function OCRPdfPage() {
  return <OCRPdfClient />;
}
