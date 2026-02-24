"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

// Import new Dumb UI components
import JpgToPdfUpload from "@/components/ui/JpgToPdfUpload";
import JpgToPdfWorkspace from "@/components/ui/JpgToPdfWorkspace";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function JpgToPdfClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 2. LOGIC ---
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
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Converted_Assignment.pdf";
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error converting images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.jpgToPdf.title}
      description={t.jpgToPdf.description}
      navToggle={<ConvertNav active="jpg-to-pdf" />}
    >
      <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8">
        {images.length === 0 ? (
          <JpgToPdfUpload onFileChange={handleFileChange} />
        ) : (
          <JpgToPdfWorkspace
            images={images}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
            onRemove={removeImage}
            onMove={moveImage}
            onConvert={handleConvert}
          />
        )}
      </div>
    </PageShell>
  );
}
