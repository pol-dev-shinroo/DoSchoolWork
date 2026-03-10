import type { Metadata } from "next";
import EpubToPdfClient from "./EpubToPdfClient";
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
    title: `${t.epubToPdf.title} | HisPDF`,
    description: t.epubToPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/convert/epub-to-pdf`,
      languages: {
        en: "https://hispdf.com/en/convert/epub-to-pdf",
        ko: "https://hispdf.com/ko/convert/epub-to-pdf",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function EpubToPdfPage() {
  return <EpubToPdfClient />;
}
