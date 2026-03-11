import type { Metadata } from "next";
import HomeClient from "@/app/HomeClient";
import { seoDictionary, Locale } from "@/dictionaries/seo";

// NEXT.JS 16 FIX: params is now a Promise!
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const dict = seoDictionary[lang]?.home || seoDictionary.en.home;

  return {
    title: dict.title,
    description: dict.description,
  };
}

// THE FIX: Tell Next.js to build all 5 languages!
export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ko" },
    { lang: "zh" },
    { lang: "de" },
    { lang: "ru" },
  ];
}

export default function HomePage() {
  return <HomeClient />;
}
