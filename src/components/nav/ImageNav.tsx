import Link from "next/link";
import { RotateCw, Crop, Maximize } from "lucide-react";

export default function ImageNav({ active }: { active: string }) {
  const links = [
    { id: "rotate", label: "ROTATE", icon: RotateCw, href: "/image/rotate" },
    { id: "crop", label: "CROP", icon: Crop, href: "/image/crop" },
    { id: "resize", label: "RESIZE", icon: Maximize, href: "/image/resize" },
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
