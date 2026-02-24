import type { Metadata } from "next";
import WordToPdfClient from "./WordToPdfClient";

export const metadata: Metadata = {
  title: "Free Word to PDF | DoSchoolWork",
  description:
    "Convert Word documents to PDF securely and privately in your browser.",
};

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
