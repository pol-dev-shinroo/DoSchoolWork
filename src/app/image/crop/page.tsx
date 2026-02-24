import type { Metadata } from "next";
import ImageCropClient from "./ImageCropClient";

export const metadata: Metadata = {
  title: "Free Image Cropper | DoSchoolWork",
  description: "Crop backgrounds out of assignment photos instantly.",
};

export default function ImageCropPage() {
  return <ImageCropClient />;
}
