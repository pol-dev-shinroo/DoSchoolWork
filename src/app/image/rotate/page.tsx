import type { Metadata } from "next";
import ImageRotater from "@/components/ImageRotater";

export const metadata: Metadata = {
  title: "Free Image Rotator | DoSchoolWork",
  description:
    "Rotate images online for free. Fix upside-down scans instantly. No server upload required.",
};

export default function RotatePage() {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-4 tracking-tight text-[#355872]">
          Rotate Image
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold">
          Fix upside-down scans instantly.
        </p>
      </div>

      {/* Load the Client Component */}
      <ImageRotater />
    </div>
  );
}
