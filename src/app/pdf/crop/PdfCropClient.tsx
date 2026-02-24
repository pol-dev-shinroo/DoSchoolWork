"use client";

import PageShell from "@/components/layouts/PageShell";
import PdfNav from "@/components/nav/PdfNav";
import PDFCropper from "@/components/PDFCropper";
import { useLanguage } from "@/context/LanguageContext";

export default function PdfCropClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.pdfCrop.title}
      description={t.pdfCrop.description}
      navToggle={<PdfNav active="crop" />}
    >
      <PDFCropper />
    </PageShell>
  );
}
