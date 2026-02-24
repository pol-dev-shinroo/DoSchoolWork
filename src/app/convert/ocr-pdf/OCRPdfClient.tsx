"use client";

import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import OCRPDF from "@/components/OCRPDF";
import { useLanguage } from "@/context/LanguageContext";

export default function OCRPdfClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.ocrPdf.title}
      description={t.ocrPdf.description}
      navToggle={<ConvertNav active="ocr-pdf" />}
    >
      <OCRPDF />
    </PageShell>
  );
}
