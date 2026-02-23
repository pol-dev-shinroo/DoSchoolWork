"use client";
import { Scissors, FileStack } from "lucide-react";

interface HeaderProps {
  activeTab: "crop" | "merge";
  onTabChange: (tab: "crop" | "merge") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#F7F8F0]/80 backdrop-blur-md z-50 border-b border-[#355872]/10">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#355872] rounded-xl flex items-center justify-center">
            <span className="text-[#F7F8F0] font-black text-xl italic">D</span>
          </div>
          <h1 className="text-2xl font-black text-[#355872] tracking-tighter">
            doschoolwork
          </h1>
        </div>

        <nav className="flex items-center gap-1 bg-[#355872]/5 p-1.5 rounded-2xl border border-[#355872]/10">
          <button
            onClick={() => onTabChange("crop")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
              activeTab === "crop"
                ? "bg-[#355872] text-[#F7F8F0] shadow-md shadow-[#355872]/20"
                : "text-[#355872]/50 hover:text-[#355872] hover:bg-white/50"
            }`}
          >
            <Scissors className="w-3.5 h-3.5" /> CROP
          </button>
          <button
            onClick={() => onTabChange("merge")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
              activeTab === "merge"
                ? "bg-[#355872] text-[#F7F8F0] shadow-md shadow-[#355872]/20"
                : "text-[#355872]/50 hover:text-[#355872] hover:bg-white/50"
            }`}
          >
            <FileStack className="w-3.5 h-3.5" /> MERGE
          </button>
        </nav>
      </div>
    </header>
  );
}
