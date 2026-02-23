"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  Construction,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to check if a path is active
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-24 bg-white/50 backdrop-blur-sm border-r border-[#355872]/10 flex flex-col items-center py-10 gap-8 z-40 hidden md:flex">
      {/* 1. PDF Tools (Links to Crop by default) */}
      <Link
        href="/pdf/crop"
        className="group relative flex flex-col items-center gap-2"
      >
        {isActive("/pdf") && (
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#355872] rounded-r-full" />
        )}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isActive("/pdf")
              ? "bg-[#355872] shadow-lg shadow-[#355872]/20"
              : "bg-white border-2 border-[#355872]/10 hover:bg-[#F7F8F0]"
          }`}
        >
          <FileText
            className={`w-7 h-7 ${isActive("/pdf") ? "text-[#F7F8F0]" : "text-[#355872]"}`}
          />
        </div>
        <span className="text-[10px] font-black text-[#355872] uppercase tracking-widest">
          PDF
        </span>
      </Link>

      {/* 2. Image Tools */}
      <Link
        href="/image/rotate"
        className="group relative flex flex-col items-center gap-2"
      >
        {isActive("/image") && (
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#355872] rounded-r-full" />
        )}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isActive("/image")
              ? "bg-[#355872] shadow-lg shadow-[#355872]/20"
              : "bg-white border-2 border-[#355872]/10 hover:bg-[#F7F8F0]"
          }`}
        >
          <ImageIcon
            className={`w-7 h-7 ${isActive("/image") ? "text-[#F7F8F0]" : "text-[#355872]"}`}
          />
        </div>
        <span className="text-[10px] font-black text-[#355872] uppercase tracking-widest">
          IMG
        </span>
      </Link>

      {/* 3. Coming Soon */}
      <div className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
        <div className="w-14 h-14 bg-[#F7F8F0] border border-[#355872]/5 rounded-2xl flex items-center justify-center">
          <Sparkles className="text-[#355872] w-6 h-6" />
        </div>
        <span className="text-[9px] font-black text-[#355872] uppercase tracking-widest text-center leading-tight">
          SOON
        </span>
      </div>
    </aside>
  );
}
