"use client";
import { useState } from "react";
import Header from "@/components/Header";
import PDFCropper from "@/components/PDFCropper";
import PDFMerger from "@/components/PDFMerger";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"crop" | "merge">("crop");

  return (
    <div className="min-h-screen pt-28">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-3xl mx-auto px-4 pb-20">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-black mb-6 tracking-tight text-[#355872]">
            Do School Work.{" "}
            <span className="text-[#7AAACE] font-extrabold italic">Better.(안녕 예원!)</span>
          </h1>
          <p className="text-lg text-[#355872]/70 font-bold">
            The ultimate toolbox for PDF assignments. <br /> 100% private,
            browser-based processing.
          </p>
        </section>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "crop" ? <PDFCropper /> : <PDFMerger />}
        </div>
      </main>
    </div>
  );
}
