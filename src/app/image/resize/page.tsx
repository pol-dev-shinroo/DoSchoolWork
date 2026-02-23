import type { Metadata } from "next";
import Link from "next/link";
import ImageResizer from "@/components/ImageResizer";
import { RotateCw, Crop, Maximize } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Resizer | DoSchoolWork",
  description:
    "Resize images to specific aspect ratios like 4:5 or 16:9 instantly.",
};

export default function ResizePage() {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-6 tracking-tight text-[#355872]">
          Resize Image.
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold">
          Perfect your aspect ratios in one click.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#355872]/10 shadow-sm overflow-x-auto max-w-full">
          <Link
            href="/image/rotate"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0] whitespace-nowrap"
          >
            <RotateCw className="w-4 h-4" /> ROTATE
          </Link>
          <Link
            href="/image/crop"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all text-[#355872]/50 hover:text-[#355872] hover:bg-[#F7F8F0] whitespace-nowrap"
          >
            <Crop className="w-4 h-4" /> CROP
          </Link>
          <Link
            href="/image/resize"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all bg-[#355872] text-[#F7F8F0] shadow-lg shadow-[#355872]/20 scale-105 whitespace-nowrap"
          >
            <Maximize className="w-4 h-4" /> RESIZE
          </Link>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <ImageResizer />
      </div>
    </div>
  );
}
