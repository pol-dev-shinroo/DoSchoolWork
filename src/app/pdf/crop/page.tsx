import type { Metadata } from "next";
import Link from "next/link";
import PDFCropper from "@/components/PDFCropper";
import { Scissors, FileStack, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Free PDF Cropper | DoSchoolWork",
  description: "Extract specific pages from your PDF assignments instantly.",
};

export default function CropPage() {
  return (
    <div className="w-full pt-4 px-4">
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[#355872]/50 hover:text-[#355872] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em]">
            Back to Toolbox
          </span>
        </Link>
      </div>

      <section className="text-center mb-10">
        <h1 className="text-5xl font-black mb-4 tracking-tight text-[#355872]">
          Crop PDF.
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold">
          Extract specific pages from your assignments instantly.
        </p>
      </section>

      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm">
          <Link
            href="/pdf/crop"
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20 scale-105"
          >
            <Scissors className="w-4 h-4" /> CROP
          </Link>
          <Link
            href="/pdf/merge"
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0]"
          >
            <FileStack className="w-4 h-4" /> MERGE
          </Link>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
        <PDFCropper />
      </div>
    </div>
  );
}
