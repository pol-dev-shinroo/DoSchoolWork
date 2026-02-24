import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import OCRPDF from "@/components/OCRPDF";

export const metadata: Metadata = {
  title: "Free OCR PDF | DoSchoolWork",
  description:
    "Make scanned PDFs searchable. Recognize text and create readable documents 100% locally.",
};

export default function OCRPdfPage() {
  return (
    <PageShell
      title="OCR PDF."
      description="Make scanned documents searchable. We'll recognize the text so you can highlight, copy, and search it."
      navToggle={<ConvertNav active="ocr-pdf" />}
    >
      <OCRPDF />
    </PageShell>
  );
}
