"use client";

import React, { useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib"; // IMPORTED PAGESIZES
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import { useLanguage } from "@/context/LanguageContext";

import ImageToPdfUpload from "@/components/ui/ImageToPdfUpload";
import ImageToPdfWorkspace from "@/components/ui/ImageToPdfWorkspace";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdfClient() {
  const { t } = useLanguage();

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

  const cleanImageViaCanvas = async (file: File): Promise<ArrayBuffer> => {
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
          blob.arrayBuffer().then(resolve);
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

      // Standard A4 dimensions in points
      const a4Width = PageSizes.A4[0];
      const a4Height = PageSizes.A4[1];
      const margin = 30; // 30-point safe margin for physical printers

      for (const img of images) {
        let embeddedImage;
        const file = img.file;

        try {
          const bytes = await file.arrayBuffer();
          if (file.type === "image/png") {
            embeddedImage = await pdfDoc.embedPng(bytes);
          } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
            embeddedImage = await pdfDoc.embedJpg(bytes);
          } else {
            throw new Error("Needs canvas conversion");
          }
        } catch (err) {
          const cleanedBytes = await cleanImageViaCanvas(file);
          embeddedImage = await pdfDoc.embedPng(cleanedBytes);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        // ==========================================
        // THE PERFECT PRINT MATH
        // Calculates how much to shrink/grow the image so it fits A4 precisely
        // ==========================================
        const maxWidth = a4Width - margin * 2;
        const maxHeight = a4Height - margin * 2;

        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Center the image on the A4 page
        const x = (a4Width - scaledWidth) / 2;
        const y = (a4Height - scaledHeight) / 2;

        const page = pdfDoc.addPage(PageSizes.A4);
        page.drawImage(embeddedImage, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], {
        type: "application/pdf",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "HisPDF_Images.pdf";
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
          <ImageToPdfUpload onFileChange={handleFileChange} />
        ) : (
          <ImageToPdfWorkspace
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
