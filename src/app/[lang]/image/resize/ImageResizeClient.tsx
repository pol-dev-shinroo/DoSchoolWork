"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import PageShell from "@/components/layouts/PageShell";
import ImageNav from "@/components/nav/ImageNav";
import { useLanguage } from "@/context/LanguageContext";
import { Area } from "react-easy-crop";

// Import our new "Dumb" UI Components
import ImageResizeUpload from "@/components/ui/ImageResizeUpload";
import ImageResizeWorkspace from "@/components/ui/ImageResizeWorkspace";

const RATIOS = [
  { id: "4:5", label: "Social Portrait", w: 4, h: 5, trendy: true },
  { id: "1:1", label: "Square / Profile", w: 1, h: 1, trendy: false },
  { id: "16:9", label: "Presentation", w: 16, h: 9, trendy: false },
  { id: "9:16", label: "Story / Reel", w: 9, h: 16, trendy: false },
];

export default function ImageResizeClient() {
  const { t } = useLanguage();

  // --- 1. STATE MANAGEMENT ---
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeRatio, setActiveRatio] = useState(RATIOS[0]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

    setImageSrc(URL.createObjectURL(file));
    setFileName(file.name);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    e.target.value = "";
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleClear = () => {
    setImageSrc(null);
    setFileName("");
  };

  const handleDownload = async () => {
    if (!imageSrc || !canvasRef.current || !croppedAreaPixels) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgElement = new window.Image();
    imgElement.src = imageSrc;

    imgElement.onload = () => {
      if (!ctx) return;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        imgElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Resized_${activeRatio.id}_${fileName}`;
            link.click();
          }
          setIsProcessing(false);
        },
        "image/png",
        1.0,
      );
    };
  };

  // --- 3. RENDER ---
  return (
    <PageShell
      title={t.imageResize.title}
      description={t.imageResize.description}
      navToggle={<ImageNav active="resize" />}
    >
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!imageSrc ? (
          <ImageResizeUpload onFileChange={handleFileChange} />
        ) : (
          <ImageResizeWorkspace
            imageSrc={imageSrc}
            fileName={fileName}
            activeRatio={activeRatio}
            ratios={RATIOS}
            crop={crop}
            zoom={zoom}
            isProcessing={isProcessing}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onRatioChange={setActiveRatio}
            onClear={handleClear}
            onDownload={handleDownload}
          />
        )}
      </div>
    </PageShell>
  );
}
