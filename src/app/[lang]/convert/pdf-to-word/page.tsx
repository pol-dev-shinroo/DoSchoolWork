import type { Metadata } from "next";
import PdfToWordClient from "./PdfToWordClient";
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
    title: `${t.pdfToWord.title} | HisPDF`,
    description: t.pdfToWord.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/pdf-to-word`,
      languages: {
        en: "https://hispdf.com/en/convert/pdf-to-word",
        ko: "https://hispdf.com/ko/convert/pdf-to-word",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
