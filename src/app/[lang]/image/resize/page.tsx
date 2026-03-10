import type { Metadata } from "next";
import ImageResizeClient from "./ImageResizeClient";
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
    title: `${t.imageResize.title} | HisPDF`,
    description: t.imageResize.description,
    alternates: {
      canonical: `https://hispdf.com/${lang}/image/resize`,
      languages: {
        en: "https://hispdf.com/en/image/resize",
        ko: "https://hispdf.com/ko/image/resize",
      },
    },
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function ResizePage() {
  return <ImageResizeClient />;
}
