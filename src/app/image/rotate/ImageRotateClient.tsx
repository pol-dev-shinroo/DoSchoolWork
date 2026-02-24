"use client";

import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageRotater from "@/components/ImageRotater";
import { useLanguage } from "@/context/LanguageContext";

export default function ImageRotateClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.imageRotate.title}
      description={t.imageRotate.description}
      navToggle={<ImageNav active="rotate" />}
    >
      <ImageRotater />
    </PageShell>
  );
}
