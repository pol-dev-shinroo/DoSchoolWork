import type { Metadata } from "next";
import Link from "next/link";
import {
  Scissors,
  FileStack,
  Image as ImageIcon,
  Sparkles,
  Crop,
  Maximize,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DoSchoolWork | Free PDF & Image Tools for Students",
  description:
    "The ultimate 100% private, browser-based toolbox for your assignments. Crop PDFs, merge files, and rotate images for free.",
};

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Tile 1: PDF Crop */}
        <Link
          href="/pdf/crop"
          className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
            <Scissors className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
          </div>
          <h2 className="text-2xl font-black text-[#355872] mb-3">Crop PDF</h2>
          <p className="text-sm font-bold text-[#7AAACE]">
            Extract specific pages from your reading assignments instantly.
          </p>
        </Link>

        {/* Tile 2: PDF Merge */}
        <Link
          href="/pdf/merge"
          className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
            <FileStack className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
          </div>
          <h2 className="text-2xl font-black text-[#355872] mb-3">Merge PDF</h2>
          <p className="text-sm font-bold text-[#7AAACE]">
            Combine multiple files into one seamless document for submission.
          </p>
        </Link>

        {/* Tile 3: Image Rotate */}
        <Link
          href="/image/rotate"
          className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
            <ImageIcon className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
          </div>
          <h2 className="text-2xl font-black text-[#355872] mb-3">
            Rotate Image
          </h2>
          <p className="text-sm font-bold text-[#7AAACE]">
            Fix upside-down phone scans of your homework in one click.
          </p>
        </Link>

        {/* Tile 4: Image Crop */}
        <Link
          href="/image/crop"
          className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
            <Crop className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
          </div>
          <h2 className="text-2xl font-black text-[#355872] mb-3">
            Crop Image
          </h2>
          <p className="text-sm font-bold text-[#7AAACE]">
            Trim unwanted borders or distracting backgrounds from your
            assignment photos.
          </p>
        </Link>

        {/* Tile 5: Image Resize */}
        <Link
          href="/image/resize"
          className="group bg-white border-2 border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center hover:border-[#9CD5FF] hover:shadow-xl hover:shadow-[#355872]/5 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-20 h-20 bg-[#F7F8F0] group-hover:bg-[#355872] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
            <Maximize className="w-10 h-10 text-[#355872] group-hover:text-[#F7F8F0] transition-colors" />
          </div>
          <h2 className="text-2xl font-black text-[#355872] mb-3">
            Resize Image
          </h2>
          <p className="text-sm font-bold text-[#7AAACE]">
            Adjust image dimensions perfectly to meet strict submission portal
            limits.
          </p>
        </Link>

        {/* Tile 6: Coming Soon */}
        <div className="bg-[#F7F8F0]/50 border-2 border-dashed border-[#355872]/10 rounded-[2rem] p-8 flex flex-col items-center text-center opacity-60">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-[#355872]/40" />
          </div>
          <h2 className="text-xl font-black text-[#355872]/60 mb-2">
            More Tools Soon
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#7AAACE]">
            Compress, Convert, Edit
          </p>
        </div>
      </div>
    </div>
  );
}
