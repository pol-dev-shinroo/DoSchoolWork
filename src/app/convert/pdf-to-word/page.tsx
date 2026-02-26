import type { Metadata } from "next";
import PdfToWordClient from "./PdfToWordClient";

export const metadata: Metadata = {
  title: "Free PDF to Word | DoSchoolWork",
  description:
    "Extract text from PDFs and convert them to editable Word documents locally.",
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
