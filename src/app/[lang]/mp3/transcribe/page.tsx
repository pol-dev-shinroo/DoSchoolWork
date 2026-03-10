import type { Metadata } from "next";
import TranscribeClient from "./TranscribeClient";

export const metadata: Metadata = {
  title: "Free MP3 to PDF Transcriber | DoSchoolWork",
  description:
    "Transcribe lectures and audio files locally in your browser with AI.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function TranscribePage() {
  return <TranscribeClient />;
}
