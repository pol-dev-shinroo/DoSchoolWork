"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  FileImage,
  Download,
  Trash2,
  MoveUp,
  MoveDown,
  Plus,
  Loader2,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function JPGToPDF() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newImages = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];
    setImages(newImages);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const imageBytes = await img.file.arrayBuffer();
        let embeddedImage;

        if (img.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const { width, height } = embeddedImage;
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      // Using Uint8Array for maximum compatibility
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Converted_Assignment.pdf";
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error converting images.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8">
      {images.length === 0 ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <FileImage className="w-12 h-12 text-[#355872]" />
          </div>
          <h2 className="font-black text-2xl text-[#355872]">JPG to PDF</h2>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            Select photos to combine
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative group bg-[#F7F8F0] p-3 rounded-2xl border-2 border-[#355872]/5 hover:border-[#355872]/20 transition-all flex flex-col gap-3"
              >
                <div className="h-32 w-full bg-white rounded-xl overflow-hidden relative">
                  <img
                    src={item.preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 bg-white rounded-lg text-[#355872] disabled:opacity-30"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="p-1.5 bg-white rounded-lg text-[#355872] disabled:opacity-30"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-[#355872] text-[#F7F8F0] text-[10px] font-black px-2 py-1 rounded-lg">
                  PG {index + 1}
                </div>
              </div>
            ))}

            <div className="relative group min-h-[160px] border-4 border-dashed border-[#355872]/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#9CD5FF]/5 transition-all">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Plus className="w-8 h-8 text-[#355872]/40" />
              <span className="text-xs font-black text-[#355872]/40 uppercase tracking-widest">
                Add More
              </span>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full bg-[#355872] flex items-center justify-center gap-3 text-[#F7F8F0] px-8 py-6 rounded-[2rem] font-black text-xl hover:bg-[#7AAACE] transition-all disabled:opacity-50 shadow-xl shadow-[#355872]/20"
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Download className="w-6 h-6" /> Download PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
