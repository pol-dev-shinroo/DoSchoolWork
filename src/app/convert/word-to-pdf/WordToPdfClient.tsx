"use client";

import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import WordToPDF from "@/components/WordToPDF";
import { useLanguage } from "@/context/LanguageContext";

export default function WordToPdfClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.wordToPdf.title}
      description={t.wordToPdf.description}
      navToggle={<ConvertNav active="word-to-pdf" />}
    >
      <WordToPDF />
    </PageShell>
  );
}
