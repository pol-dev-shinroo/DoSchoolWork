import type { Metadata } from "next";
import OCRPdfClient from "./OCRPdfClient";

export const metadata: Metadata = {
  title: "Free OCR PDF | DoSchoolWork",
  description: "Make scanned PDFs searchable and editable 100% locally.",
};

export default function OCRPdfPage() {
  return <OCRPdfClient />;
}
