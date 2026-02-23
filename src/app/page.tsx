"use client";
import { useState } from "react";
import PDFCropper from "@/components/PDFCropper";
import PDFMerger from "@/components/PDFMerger";
import { Scissors, FileStack } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"crop" | "merge">("crop");

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <section className="text-center mb-10">
        <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-950">
          Do Your School Work.{" "}
          <span className="text-indigo-600 font-extrabold">Better.(안녕 예원!)</span>
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          The ultimate toolbox for PDF assignments. <br /> 100% private,
          browser-based processing.
        </p>
      </section>

      <div className="flex justify-center mb-8 p-1.5 bg-slate-100 rounded-[2rem] w-fit mx-auto shadow-inner">
        <button
          onClick={() => setActiveTab("crop")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-bold text-sm transition-all ${
            activeTab === "crop"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Scissors className="w-4 h-4" /> Crop
        </button>
        <button
          onClick={() => setActiveTab("merge")}
          className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] font-bold text-sm transition-all ${
            activeTab === "merge"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
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
