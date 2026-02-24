import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import ImageRotater from "@/components/ImageRotater";

export const metadata: Metadata = {
  title: "Free Image Rotator | DoSchoolWork",
  description: "Fix upside-down scans instantly.",
};

export default function RotatePage() {
  return (
    <PageShell
      title="Rotate Image."
      description="Fix upside-down phone scans instantly. No server uploads, 100% private."
      navToggle={<ImageNav active="rotate" />}
    >
      <ImageRotater />
    </PageShell>
  );
}
