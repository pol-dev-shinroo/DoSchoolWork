"use client";

import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import PDFToWord from "@/components/PDFToWord";
import { useLanguage } from "@/context/LanguageContext";

export default function PdfToWordClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.pdfToWord.title}
      description={t.pdfToWord.description}
      navToggle={<ConvertNav active="pdf-to-word" />}
    >
      <PDFToWord />
    </PageShell>
  );
}
