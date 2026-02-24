import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageCropper from "@/components/ImageCropper";

export const metadata: Metadata = {
  title: "Free Image Cropper | DoSchoolWork",
  description: "Cut out unnecessary backgrounds from your document photos.",
};

export default function ImageCropPage() {
  return (
    <PageShell
      title="Crop Image."
      description="Cut out the unnecessary background from your photos to make them look professional."
      navToggle={<ImageNav active="crop" />}
    >
      <ImageCropper />
    </PageShell>
  );
}
