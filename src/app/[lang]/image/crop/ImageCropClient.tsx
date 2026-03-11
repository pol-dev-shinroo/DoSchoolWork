"use client";

import React, { useState, useRef, useEffect } from "react";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import { useLanguage } from "@/context/LanguageContext";
import { type Crop, type PixelCrop } from "react-image-crop";

// Import new Dumb UI components
import ImageCropUpload from "@/components/ui/ImageCropUpload";
import ImageCropWorkspace from "@/components/ui/ImageCropWorkspace";

export default function ImageCropClient() {
  const { t } = useLanguage();

  // --- 1. STATE ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs for logic (Image for dimensions, Canvas for processing)
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // TAB CLOSE PROTECTION
  // ==========================================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isProcessing]);

  // ==========================================
  // WRONG FILE ALERT
  // ==========================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload a valid image (JPG, PNG, WebP).");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setFileName(file.name);
    setCrop(undefined);
    setCompletedCrop(null);
    e.target.value = "";
  };

  const handleClear = () => {
    setImageSrc(null);
    setFileName("");
    setCrop(undefined);
    setCompletedCrop(null);
  };

  const handleDownload = async () => {
    if (!completedCrop || !imageRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Cropped_${fileName}`;
        link.click();
      }
      setIsProcessing(false);
    }, "image/png");
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.imageCrop.title}
      description={t.imageCrop.description}
      navToggle={<ImageNav active="crop" />}
    >
      {/* Hidden Canvas Logic */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!imageSrc ? (
          <ImageCropUpload onFileChange={handleFileChange} />
        ) : (
          <ImageCropWorkspace
            imageSrc={imageSrc}
            fileName={fileName}
            crop={crop}
            imageRef={imageRef}
            isProcessing={isProcessing}
            isValidCrop={!!completedCrop?.width && !!completedCrop?.height}
            setCrop={setCrop}
            setCompletedCrop={setCompletedCrop}
            onClear={handleClear}
            onDownload={handleDownload}
          />
        )}
      </div>
    </PageShell>
  );
}
