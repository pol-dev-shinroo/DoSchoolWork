"use client";
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  Construction,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-20 bottom-0 w-24 bg-white/50 backdrop-blur-sm border-r border-[#355872]/10 flex flex-col items-center py-10 gap-8 z-40 hidden md:flex">
      {/* 1. PDF Tools (Active) */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer relative">
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#355872] rounded-r-full" />
        <div className="w-14 h-14 bg-[#355872] rounded-2xl flex items-center justify-center shadow-lg shadow-[#355872]/20 transition-all group-hover:scale-105 group-active:scale-95">
          <FileText className="text-[#F7F8F0] w-7 h-7" />
        </div>
        <span className="text-[10px] font-black text-[#355872] uppercase tracking-widest">
          PDF
        </span>
      </div>

      {/* 2. Image Tools (Inactive) */}
      <div className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-14 h-14 bg-white border-2 border-[#355872]/10 rounded-2xl flex items-center justify-center hover:bg-[#F7F8F0] hover:border-[#355872]/30 transition-all">
          <ImageIcon className="text-[#355872] w-7 h-7" />
        </div>
        <span className="text-[10px] font-black text-[#355872] uppercase tracking-widest">
          IMG
        </span>
      </div>

      {/* 3. Coming Soon */}
      <div className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
        <div className="w-14 h-14 bg-[#F7F8F0] border border-[#355872]/5 rounded-2xl flex items-center justify-center">
          <Sparkles className="text-[#355872] w-6 h-6" />
        </div>
        <span className="text-[9px] font-black text-[#355872] uppercase tracking-widest text-center leading-tight">
          SOON
        </span>
      </div>

      {/* 4. Coming Soon */}
      <div className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
        <div className="w-14 h-14 bg-[#F7F8F0] border border-[#355872]/5 rounded-2xl flex items-center justify-center">
          <Construction className="text-[#355872] w-6 h-6" />
        </div>
        <span className="text-[9px] font-black text-[#355872] uppercase tracking-widest text-center leading-tight">
          SOON
        </span>
      </div>
    </aside>
  );
}
