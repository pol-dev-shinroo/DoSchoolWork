import React from "react";
import { FileImage } from "lucide-react";

interface JpgToPdfUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function JpgToPdfUpload({ onFileChange }: JpgToPdfUploadProps) {
  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        multiple
        // 1. Upgraded to accept all major image formats!
        accept="image/png, image/jpeg, image/webp, image/gif, image/bmp"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <FileImage className="w-12 h-12 text-[#355872]" />
      </div>
      {/* 2. Updated Branding */}
      <h2 className="font-black text-2xl text-[#355872]">Image to PDF</h2>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        Select images to combine
      </p>
    </div>
  );
}
