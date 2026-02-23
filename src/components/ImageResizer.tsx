"use client";
import { useState, useRef, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Maximize,
  Download,
  Image as ImageIcon,
  Trash2,
  Star,
  ZoomIn,
} from "lucide-react";

// Industry standard aspect ratios
const RATIOS = [
  { id: "4:5", label: "Social Portrait", w: 4, h: 5, trendy: true },
  { id: "1:1", label: "Square / Profile", w: 1, h: 1, trendy: false },
  { id: "16:9", label: "Presentation", w: 16, h: 9, trendy: false },
  { id: "9:16", label: "Story / Reel", w: 9, h: 16, trendy: false },
];

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeRatio, setActiveRatio] = useState(RATIOS[0]);

  // New Interactive Cropper States
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setFileName(file.name);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  // Runs every time the user drags or zooms
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleDownload = async () => {
    if (!imageSrc || !canvasRef.current || !croppedAreaPixels) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgElement = new Image();
    imgElement.src = imageSrc;

    imgElement.onload = () => {
      if (!ctx) return;

      // Set canvas to the exact pixel size of the framed area
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Ensure high quality slicing
      ctx.imageSmoothingQuality = "high";

      // Slice out the exact coordinates the user framed
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

  return (
    <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      <canvas ref={canvasRef} className="hidden" />

      {!imageSrc ? (
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <Maximize className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">Upload Image</p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            JPG, PNG, WebP supported
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          <div className="flex items-center gap-2 bg-[#F7F8F0] px-4 py-2 rounded-xl border border-[#355872]/10 w-full justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <ImageIcon className="w-4 h-4 text-[#355872] flex-shrink-0" />
              <span className="font-bold text-[#355872] text-sm truncate">
                {fileName}
              </span>
            </div>
            <button
              onClick={() => setImageSrc(null)}
              className="ml-4 text-[#7AAACE] hover:text-red-500 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Drag & Zoom Area */}
          <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-4 border-[#F7F8F0]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={activeRatio.w / activeRatio.h}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={true} // Shows the rule-of-thirds grid while dragging!
            />
          </div>

          {/* Zoom Slider */}
          <div className="w-full flex items-center gap-4 px-4 bg-[#F7F8F0]/50 p-4 rounded-2xl border border-[#355872]/5">
            <ZoomIn className="w-5 h-5 text-[#355872]/50" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-[#355872]/20 rounded-lg appearance-none cursor-pointer accent-[#355872]"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setActiveRatio(ratio)}
                className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                  activeRatio.id === ratio.id
                    ? "border-[#355872] bg-[#F7F8F0] shadow-md scale-105"
                    : "border-[#355872]/10 bg-white hover:border-[#9CD5FF]"
                }`}
              >
                {ratio.trendy && (
                  <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm transform rotate-6 z-10">
                    <Star className="w-3 h-3 fill-yellow-900" /> TRENDY
                  </div>
                )}
                <span
                  className={`font-black text-lg ${activeRatio.id === ratio.id ? "text-[#355872]" : "text-[#7AAACE]"}`}
                >
                  {ratio.id}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-center">
                  {ratio.label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full bg-[#355872] text-[#F7F8F0] px-6 py-5 rounded-2xl font-black text-lg hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#355872]/20 disabled:opacity-30 disabled:grayscale mt-2"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Download className="w-6 h-6" /> Export as {activeRatio.id}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
