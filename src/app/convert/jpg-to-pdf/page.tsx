import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import JPGToPDF from "@/components/JPGToPDF";

export const metadata: Metadata = {
  title: "Free JPG to PDF | DoSchoolWork",
};

export default function JpgToPdfPage() {
  return (
    <PageShell
      title="JPG to PDF."
      description="Turn your photos into professional PDFs for submission."
      navToggle={<ConvertNav active="jpg-to-pdf" />}
    >
      <JPGToPDF />
    </PageShell>
  );
}
