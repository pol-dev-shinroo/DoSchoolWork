"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileAudio } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Mp3Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t.mp3ToPdf.title.replace(".", ""), // Dynamically grab translated name
      href: "/mp3/transcribe",
      icon: FileAudio,
    },
  ];

  return (
    <div className="inline-flex bg-[#F7F8F0] p-1.5 rounded-2xl border-2 border-[#355872]/5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${
              isActive
                ? "bg-white text-[#355872] shadow-sm border border-[#355872]/10"
                : "text-[#355872]/40 hover:text-[#355872]/70 hover:bg-white/50"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-[#7AAACE]" : ""}`} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
