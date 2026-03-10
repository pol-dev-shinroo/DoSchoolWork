import type { Metadata } from "next";
import ImageRotateClient from "./ImageRotateClient";
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
    title: `${t.imageRotate.title} | HisPDF`,
    description: t.imageRotate.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/rotate`,
      languages: {
        en: "https://hispdf.com/en/image/rotate",
        ko: "https://hispdf.com/ko/image/rotate",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function RotatePage() {
  return <ImageRotateClient />;
}
