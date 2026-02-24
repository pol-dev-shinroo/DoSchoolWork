import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageResizer from "@/components/ImageResizer";

export const metadata: Metadata = {
  title: "Image Resizer | DoSchoolWork",
  description: "Perfect your aspect ratios in one click.",
};

export default function ResizePage() {
  return (
    <PageShell
      title="Resize Image."
      description="Perfect your aspect ratios for any assignment in one click."
      navToggle={<ImageNav active="resize" />}
    >
      <ImageResizer />
    </PageShell>
  );
}
