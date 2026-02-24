import React from "react";
import { Scissors } from "lucide-react";

interface ImageCropUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageCropUpload({
  onFileChange,
}: ImageCropUploadProps) {
  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <Scissors className="w-12 h-12 text-[#355872]" />
      </div>
      <p className="font-black text-2xl text-[#355872]">Upload Image</p>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        JPG, PNG, WebP supported
      </p>
    </div>
  );
}
