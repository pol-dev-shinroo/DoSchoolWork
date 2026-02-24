import React from "react";
import { Loader2 } from "lucide-react";

interface TranscribeProgressProps {
  progressLabel: string;
  progressPercent: number;
}

// THE FIX: Notice the "export default function" here
export default function TranscribeProgress({
  progressLabel,
  progressPercent,
}: TranscribeProgressProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-[#355872]/10 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center gap-4">
        <Loader2 className="w-6 h-6 text-[#355872] animate-spin" />
        <span className="text-sm font-black text-[#355872]">
          {progressLabel}
        </span>
      </div>
      <div className="h-4 w-full bg-[#F7F8F0] rounded-full overflow-hidden border border-[#355872]/5 relative">
        <div
          className="h-full bg-[#355872] transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
