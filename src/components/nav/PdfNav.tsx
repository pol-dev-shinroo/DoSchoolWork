import Link from "next/link";
import { Scissors, FileStack } from "lucide-react";

export default function PdfNav({ active }: { active: string }) {
  const links = [
    { id: "crop", label: "CROP", icon: Scissors, href: "/pdf/crop" },
    { id: "merge", label: "MERGE", icon: FileStack, href: "/pdf/merge" },
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${
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
