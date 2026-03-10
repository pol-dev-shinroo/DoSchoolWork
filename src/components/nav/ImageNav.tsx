"use client";

import Link from "next/link";
import { RotateCw, Crop, Maximize, FileImage } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ImageNav({ active }: { active: string }) {
  const { locale } = useLanguage();

  const links = [
    // 1. Added the Image to PDF tool here!
    {
      id: "image-to-pdf",
      label: "IMAGE TO PDF",
      icon: FileImage,
      href: `/${locale}/image/image-to-pdf`,
    },
    {
      id: "rotate",
      label: "ROTATE",
      icon: RotateCw,
      href: `/${locale}/image/rotate`,
    },
    { id: "crop", label: "CROP", icon: Crop, href: `/${locale}/image/crop` },
    {
      id: "resize",
      label: "RESIZE",
      icon: Maximize,
      href: `/${locale}/image/resize`,
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm overflow-x-auto max-w-full scrollbar-hide">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${
            active === link.id
              ? "bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20 scale-105"
              : "text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0]"
          }`}
        >
          <link.icon className="w-4 h-4" /> {link.label}
        </Link>
      ))}
    </div>
  );
}
