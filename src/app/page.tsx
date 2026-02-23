"use client";
import { useState } from "react";
import PDFCropper from "@/components/PDFCropper";
import PDFMerger from "@/components/PDFMerger";
import { Scissors, FileStack } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"crop" | "merge">("crop");

  return (
    <div className="max-w-3xl mx-auto py-20 px-4 min-h-screen">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-black mb-6 tracking-tight text-[#355872]">
          Do School Work.{" "}
          <span className="text-[#7AAACE] font-extrabold italic">Better.</span>
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold">
          The ultimate toolbox for PDF assignments. <br /> 100% private,
          browser-based processing.
        </p>
      </section>

      <div className="flex justify-center mb-10 p-1.5 bg-[#355872]/5 rounded-[2rem] w-fit mx-auto border border-[#355872]/10 shadow-inner">
        <button
          onClick={() => setActiveTab("crop")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all ${
            activeTab === "crop"
              ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20"
              : "text-[#355872]/60 hover:text-[#355872]"
          }`}
        >
          <Scissors className="w-4 h-4" /> Crop
        </button>
        <button
          onClick={() => setActiveTab("merge")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-black text-sm transition-all ${
            activeTab === "merge"
              ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20"
              : "text-[#355872]/60 hover:text-[#355872]"
          }`}
        >
          <FileStack className="w-4 h-4" /> Merge
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "crop" ? <PDFCropper /> : <PDFMerger />}
      </div>
    </div>
  );
}
