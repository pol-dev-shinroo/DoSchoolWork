"use client";

import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageCropper from "@/components/ImageCropper";
import { useLanguage } from "@/context/LanguageContext";

export default function ImageCropClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      title={t.imageCrop.title}
      description={t.imageCrop.description}
      navToggle={<ImageNav active="crop" />}
    >
      <ImageCropper />
    </PageShell>
  );
}
