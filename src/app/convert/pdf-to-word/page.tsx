import type { Metadata } from "next";
import PdfToWordClient from "./PdfToWordClient";

export const metadata: Metadata = {
  title: "Free PDF to Word | DoSchoolWork",
  description: "Extract text from PDFs into editable Word documents instantly.",
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
