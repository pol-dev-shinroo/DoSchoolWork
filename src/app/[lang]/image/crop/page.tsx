import type { Metadata } from "next";
import ImageCropClient from "./ImageCropClient";

export const metadata: Metadata = {
  title: "Free Image Cropper | DoSchoolWork",
  description: "Crop backgrounds out of assignment photos instantly.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function ImageCropPage() {
  return <ImageCropClient />;
}
