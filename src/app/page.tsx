"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PDFCropper from "@/components/PDFCropper";
import PDFMerger from "@/components/PDFMerger";
import { Scissors, FileStack } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"crop" | "merge">("crop");

  return (
    <div className="min-h-screen pt-28">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pb-20">
        <section className="text-center mb-10">
          <h1 className="text-5xl font-black mb-6 tracking-tight text-[#355872]">
            Do School Work.
          </h1>
          <p className="text-lg text-[#355872]/70 font-bold">
            The ultimate toolbox for PDF assignments. <br /> 100% private,
            browser-based processing.
          </p>
        </section>

        {/* Relocated Tool Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-[#355872]/5 p-2 rounded-2xl border border-[#355872]/10">
            <button
              onClick={() => setActiveTab("crop")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${
                activeTab === "crop"
                  ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20"
                  : "text-[#355872]/50 hover:text-[#355872] hover:bg-white/50"
              }`}
            >
              <Scissors className="w-4 h-4" /> CROP
            </button>
            <button
              onClick={() => setActiveTab("merge")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all ${
                activeTab === "merge"
                  ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20"
                  : "text-[#355872]/50 hover:text-[#355872] hover:bg-white/50"
              }`}
            >
              <FileStack className="w-4 h-4" /> MERGE
            </button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "crop" ? <PDFCropper /> : <PDFMerger />}
        </div>
      </main>
    </div>
  );
}
