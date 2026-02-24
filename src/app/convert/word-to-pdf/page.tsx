import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import WordToPDF from "@/components/WordToPDF";

export const metadata: Metadata = {
  title: "Free Word to PDF | DoSchoolWork",
  description: "Convert Word documents to PDF instantly and privately.",
};

export default function WordToPdfPage() {
  return (
    <PageShell
      title="Word to PDF."
      description="Lock your essays into secure PDFs. 100% private, processed directly in your browser."
      navToggle={<ConvertNav active="word-to-pdf" />}
    >
      <WordToPDF />
    </PageShell>
  );
}
