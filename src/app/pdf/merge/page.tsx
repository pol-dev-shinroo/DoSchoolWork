import type { Metadata } from "next";
import PdfMergeClient from "./PdfMergeClient";

export const metadata: Metadata = {
  title: "Free PDF Merger | DoSchoolWork",
  description:
    "Combine multiple PDF files securely and privately in your browser.",
};

export default function MergePage() {
  return <PdfMergeClient />;
}
