import type { Metadata } from "next";
import Link from "next/link";
import {
  Scissors,
  FileStack,
  Image as ImageIcon,
  Sparkles,
  Crop,
  Maximize,
  FileImage,
  FileText,
  FileType,
  FileSearch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DoSchoolWork | Free PDF & Image Tools for Students",
  description:
    "The ultimate 100% private, browser-based toolbox for your assignments. Crop PDFs, merge files, and rotate images for free.",
};

// 1. Define our tool data in a clean array
const TOOLS = [
  {
    href: "/pdf/crop",
    icon: Scissors,
    title: "Crop PDF",
    description:
      "Extract specific pages from your reading assignments instantly.",
  },
  {
    href: "/pdf/merge",
    icon: FileStack,
    title: "Merge PDF",
    description:
      "Combine multiple files into one seamless document for submission.",
  },
  {
    href: "/image/rotate",
    icon: ImageIcon,
    title: "Rotate Image",
    description: "Fix upside-down phone scans of your homework in one click.",
  },
  {
    href: "/image/crop",
    icon: Crop,
    title: "Crop Image",
    description:
      "Trim unwanted borders or distracting backgrounds from your assignment photos.",
  },
  {
    href: "/image/resize",
    icon: Maximize,
    title: "Resize Image",
    description:
      "Adjust image dimensions perfectly to meet strict submission portal limits.",
  },
  {
    href: "/convert/jpg-to-pdf",
    icon: FileImage,
    title: "JPG to PDF",
    description:
      "Convert your assignment photos into a single, easy-to-submit PDF document.",
  },
  {
    href: "/convert/word-to-pdf",
    icon: FileText,
    title: "Word to PDF",
    description:
      "Lock your essays and reports into secure PDFs before uploading them.",
  },
  {
    href: "/convert/pdf-to-word",
    icon: FileType,
    title: "PDF to Word",
    description:
      "Extract text from PDFs into editable Word documents instantly.",
  },
  {
    href: "/convert/ocr-pdf",
    icon: FileSearch,
    title: "OCR PDF",
    description:
      "Make PDFs searchable and recognize text from scanned documents.",
  },
];

export default function HomePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-16 pt-8">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-[#355872]">
          Do School Work.
        </h1>
        <p className="text-lg md:text-xl text-[#355872]/70 font-bold max-w-2xl mx-auto">
          The ultimate toolbox for your assignments.{" "}
          <br className="hidden md:block" />
          100% private, browser-based processing. Zero server uploads.
        </p>
      </section>

      {/* Feature Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-16">
        {/* 2. Loop through the array to generate our tiles! */}
        {TOOLS.map((tool) => {
          const Icon = tool.icon; // Extract the icon component for rendering
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <Icon className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
              </div>
              <h2 className="text-2xl font-black text-[#355872] mb-3">
                {tool.title}
              </h2>
              <p className="text-sm font-bold text-[#7AAACE]">
                {tool.description}
              </p>
            </Link>
          );
        })}

        {/* Coming Soon Tile (Static) */}
        <div className="bg-[#F7F8F0]/50 border-2 border-dashed border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center opacity-60">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-[#355872]/40" />
          </div>
          <h2 className="text-xl font-black text-[#355872]/60 mb-2">
            More Tools Soon
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7AAACE]">
            Compress, Protect, Edit
          </p>
        </div>
      </div>
    </div>
  );
}
