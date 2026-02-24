"use client";

import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageResizer from "@/components/ImageResizer";
import { useLanguage } from "@/context/LanguageContext";

export default function ImageResizeClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.imageResize.title}
      description={t.imageResize.description}
      navToggle={<ImageNav active="resize" />}
    >
      <ImageResizer />
    </PageShell>
  );
}
