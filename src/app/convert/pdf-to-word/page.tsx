import type { Metadata } from "next";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import PDFToWord from "@/components/PDFToWord";

export const metadata: Metadata = {
  title: "Free PDF to Word | DoSchoolWork",
  description: "Extract text from PDFs into editable Word documents instantly.",
};

export default function PdfToWordPage() {
  return (
    <PageShell
      title="PDF to Word."
      description="Need to edit a reading assignment? Extract the text from your PDF into a fully editable Word document in seconds."
      navToggle={<ConvertNav active="pdf-to-word" />}
    >
      <PDFToWord />
    </PageShell>
  );
}
