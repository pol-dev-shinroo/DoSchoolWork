import Link from "next/link";
import { FileImage, FileText, FileType, FileSearch } from "lucide-react";

export default function ConvertNav({ active }: { active: string }) {
  // Reordered list as per your request
  const links = [
    {
      id: "pdf-to-word",
      label: "PDF TO WORD",
      icon: FileType,
      href: "/convert/pdf-to-word",
    },
    {
      id: "ocr-pdf",
      label: "OCR PDF",
      icon: FileSearch,
      href: "/convert/ocr-pdf",
    },
    {
      id: "jpg-to-pdf",
      label: "JPG TO PDF",
      icon: FileImage,
      href: "/convert/jpg-to-pdf",
    },
    {
      id: "word-to-pdf",
      label: "WORD TO PDF",
      icon: FileText,
      href: "/convert/word-to-pdf",
    },
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm overflow-x-auto max-w-full scrollbar-hide">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-black text-xs md:text-sm transition-all whitespace-nowrap ${
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
