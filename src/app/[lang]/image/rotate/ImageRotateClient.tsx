"use client";

import React, { useState, useRef } from "react";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import { useLanguage } from "@/context/LanguageContext";
import { useProcessingWarning } from "@/hooks/useProcessingWarning";

import ImageRotateUpload from "@/components/ui/ImageRotateUpload";
import ImageRotateWorkspace from "@/components/ui/ImageRotateWorkspace";

export default function ImageRotateClient() {
  const { t } = useLanguage();

  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tab Close Protection Hook
  useProcessingWarning(isProcessing, t.common.processingWarning);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload a valid image (JPG, PNG, WebP).");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setImage(url);
    setFileName(file.name);
    setRotation(0);
    e.target.value = "";
  };

  const handleClear = () => {
    setImage(null);
    setFileName("");
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = async () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgElement = new window.Image();
    imgElement.src = image;

    imgElement.onload = () => {
      // A. Swap Dimensions based on rotation angle
      if (rotation % 180 !== 0) {
        canvas.width = imgElement.height;
        canvas.height = imgElement.width;
      } else {
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
      }

      if (ctx) {
        // B. Move the Pivot Point
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // C. Rotate the canvas
        ctx.rotate((rotation * Math.PI) / 180);

        // D. Draw the image
        ctx.drawImage(
          imgElement,
          -imgElement.width / 2,
          -imgElement.height / 2,
        );

        // E. Save as File
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Rotated_${fileName}`;
            link.click();
          }
          setIsProcessing(false);
        }, "image/png");
      }
    };
  };

  return (
    <PageShell
      title={t.imageRotate.title}
      description={t.imageRotate.description}
      navToggle={<ImageNav active="rotate" />}
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!image ? (
          <ImageRotateUpload onFileChange={handleFileChange} />
        ) : (
          <ImageRotateWorkspace
            imageSrc={image}
            fileName={fileName}
            rotation={rotation}
            isProcessing={isProcessing}
            onRotate={handleRotate}
            onClear={handleClear}
            onDownload={handleDownload}
          />
        )}
      </div>
    </PageShell>
  );
}
