import React from "react";
import { FileStack } from "lucide-react";

interface PdfMergeUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PdfMergeUpload({ onFileChange }: PdfMergeUploadProps) {
  return (
    <div className="group text-center py-12 relative">
      <input
        type="file"
        multiple
        accept="application/pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
        <FileStack className="w-12 h-12 text-[#355872]" />
      </div>
      <p className="font-black text-2xl text-[#355872]">Merge Documents</p>
      <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
        Select files to combine
      </p>
    </div>
  );
}
