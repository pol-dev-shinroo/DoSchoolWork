"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // 1. Configuration: Default entry points for each category
  const navItems = [
    {
      label: "PDF",
      href: "/pdf/crop", // Default if coming from outside
      pattern: "/pdf",
      icon: FileText,
    },
    {
      label: "IMG",
      href: "/image/rotate", // Default if coming from outside
      pattern: "/image",
      icon: ImageIcon,
    },
    {
      label: "Convert",
      href: "/convert/pdf-to-word", // Default if coming from outside
      pattern: "/convert",
      icon: ArrowRightLeft,
    },
  ];

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-24 bg-white/50 backdrop-blur-sm border-r border-[#355872]/10 flex flex-col items-center py-10 gap-8 z-40 hidden md:flex">
      {navItems.map((item) => {
        // Check if user is currently inside this category
        const isInCategory = pathname.startsWith(item.pattern);
        const Icon = item.icon;

        // STICKY LOGIC:
        // If we are already in the category, the link keeps us where we are.
        // If we are coming from another section, it takes us to the default.
        const finalHref = isInCategory ? pathname : item.href;

        return (
          <Link
            key={item.label}
            href={finalHref}
            className="group relative flex flex-col items-center gap-2"
          >
            {/* Active Indicator Line */}
            {isInCategory && (
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#355872] rounded-r-full animate-in slide-in-from-left-full duration-300" />
            )}

            {/* Icon Container */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isInCategory
                  ? "bg-[#355872] shadow-lg shadow-[#355872]/20 scale-105"
                  : "bg-white border-2 border-[#355872]/10 hover:bg-[#F7F8F0] hover:border-[#355872]/20"
              }`}
            >
              <Icon
                className={`w-7 h-7 transition-colors ${
                  isInCategory ? "text-[#F7F8F0]" : "text-[#355872]"
                }`}
              />
            </div>

            {/* Label */}
            <span
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                isInCategory ? "text-[#355872]" : "text-[#355872]/40"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* Coming Soon Section */}
      <div className="mt-auto mb-4 flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
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
