"use client";

import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import JPGToPDF from "@/components/JPGToPDF";
import { useLanguage } from "@/context/LanguageContext";

export default function JpgToPdfClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.jpgToPdf.title}
      description={t.jpgToPdf.description}
      navToggle={<ConvertNav active="jpg-to-pdf" />}
    >
      <JPGToPDF />
    </PageShell>
  );
}
