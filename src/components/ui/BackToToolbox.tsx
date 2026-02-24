import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToToolbox() {
  return (
    <div className="max-w-4xl mx-auto mb-4">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-[#355872]/50 hover:text-[#355872] transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
        <span className="text-[11px] font-black uppercase tracking-[0.25em]">
          Back to Toolbox
        </span>
      </Link>
    </div>
  );
}
