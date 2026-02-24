import type { Metadata } from "next";
import TranscribeClient from "./TranscribeClient";

export const metadata: Metadata = {
  title: "MP3 to PDF | DoSchoolWork",
  description:
    "Transcribe audio lectures and voice notes into readable PDFs for free.",
};

export default function TranscribePage() {
  return <TranscribeClient />;
}
