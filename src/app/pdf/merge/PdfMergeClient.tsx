"use client";

import PageShell from "@/components/layouts/PageShell";
import PdfNav from "@/components/nav/PdfNav";
import PDFMerger from "@/components/PDFMerger";
import { useLanguage } from "@/context/LanguageContext";

export default function PdfMergeClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.pdfMerge.title}
      description={t.pdfMerge.description}
      navToggle={<PdfNav active="merge" />}
    >
      <PDFMerger />
    </PageShell>
  );
}
