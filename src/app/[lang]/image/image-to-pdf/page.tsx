import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";
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
    title: `${t.imageToPdf.title} | HisPDF`,
    description: t.imageToPdf.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/image-to-pdf`,
      languages: {
        en: "https://hispdf.com/en/image/image-to-pdf",
        ko: "https://hispdf.com/ko/image/image-to-pdf",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
