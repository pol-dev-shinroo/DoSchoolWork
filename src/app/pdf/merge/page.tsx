import type { Metadata } from "next";
import Link from "next/link";
import PDFMerger from "@/components/PDFMerger";
import { Scissors, FileStack } from "lucide-react";

export const metadata: Metadata = {
  title: "Free PDF Merger | DoSchoolWork",
  description:
    "Combine multiple PDF files securely and privately right in your browser.",
};

export default function MergePage() {
  return (
    <div className="w-full">
      <section className="text-center mb-10">
        <h1 className="text-5xl font-black mb-6 tracking-tight text-[#355872]">
          Merge PDF.
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold">
          Combine multiple files into one seamless document.
        </p>
      </section>

      {/* URL-Based Tool Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm">
          <Link
            href="/pdf/crop"
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0]"
          >
            <Scissors className="w-4 h-4" /> CROP
          </Link>
          <Link
            href="/pdf/merge"
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20 scale-105"
          >
            <FileStack className="w-4 h-4" /> MERGE
          </Link>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <PDFMerger />
      </div>
    </div>
  );
}
