"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import { useLanguage } from "@/context/LanguageContext";

// Note: You can rename these UI components later, but I kept the imports
// the same for now so your app doesn't break!
import JpgToPdfUpload from "@/components/ui/JpgToPdfUpload";
import JpgToPdfWorkspace from "@/components/ui/JpgToPdfWorkspace";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdfClient() {
  const { t } = useLanguage();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Allow multiple formats
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

  // The Magic Canvas Converter for WEBP/BMP/GIF
  const convertToCompatibleBytes = async (
    file: File,
  ): Promise<{ bytes: ArrayBuffer; type: "png" | "jpg" }> => {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      return {
        bytes: await file.arrayBuffer(),
        type: file.type === "image/png" ? "png" : "jpg",
      };
    }

    // If it's WEBP, GIF, etc., draw to canvas and export as PNG
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return reject("Blob conversion failed");
          blob.arrayBuffer().then((bytes) => resolve({ bytes, type: "png" }));
        }, "image/png");
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        // Use our new converter to guarantee pdf-lib won't crash
        const { bytes, type } = await convertToCompatibleBytes(img.file);
        let embeddedImage;

        if (type === "png") {
          embeddedImage = await pdfDoc.embedPng(bytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(bytes);
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
      link.download = "HisPDF_Images.pdf"; // Updated brand name
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error converting images. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageShell
      title={t.imageToPdf.title}
      description={t.imageToPdf.description}
      navToggle={<ImageNav active="image-to-pdf" />}
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
