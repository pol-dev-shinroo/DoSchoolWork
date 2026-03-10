import type { Metadata } from "next";
import PdfCropClient from "./PdfCropClient";

export const metadata: Metadata = {
  title: "Free PDF Cropper | DoSchoolWork",
  description: "Extract specific pages from your PDF assignments instantly.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function CropPage() {
  return <PdfCropClient />;
}
