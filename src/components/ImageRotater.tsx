"use client";
import { useState, useRef } from "react";
import {
  UploadCloud,
  RotateCw,
  Download,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

export default function ImageRotater() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. The Hidden Canvas: This is our "digital darkroom"
  // We don't show this to the user, but we use it to process the file.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary URL for the uploaded file so we can show a preview
      const url = URL.createObjectURL(file);
      setImage(url);
      setFileName(file.name);
      setRotation(0); // Reset rotation to 0 for new images
    }
  };

  // 2. The Visual Rotation (CSS Only)
  // This just updates the preview on the screen instantly.
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // 3. The Actual Rotation (Canvas Math)
  // This runs when the user clicks "Download". It permanently burns the rotation into the file.
  const handleDownload = async () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgElement = new Image();
    imgElement.src = image;

    // Wait for the image to load into memory
    imgElement.onload = () => {
      // A. Swap Dimensions: If rotating 90 or 270, width becomes height.
      if (rotation % 180 !== 0) {
        canvas.width = imgElement.height;
        canvas.height = imgElement.width;
      } else {
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
      }

      if (ctx) {
        // B. Move the "Pivot Point" to the center of the canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // C. Rotate the canvas
        ctx.rotate((rotation * Math.PI) / 180);

        // D. Draw the image (offset by half its size to center it)
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
    <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {/* Hidden Canvas Element */}
      <canvas ref={canvasRef} className="hidden" />

      {!image ? (
        // UPLOAD STATE
        <div className="group text-center py-12 relative">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-24 h-24 bg-[#9CD5FF]/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">Upload Image</p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            JPG, PNG, WebP supported
          </p>
        </div>
      ) : (
        // EDIT STATE
        <div className="flex flex-col gap-8 items-center">
          <div className="flex items-center gap-2 bg-[#F7F8F0] px-4 py-2 rounded-xl border border-[#355872]/10">
            <ImageIcon className="w-4 h-4 text-[#355872]" />
            <span className="font-bold text-[#355872] text-sm truncate max-w-[200px]">
              {fileName}
            </span>
            <button
              onClick={() => setImage(null)}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Window */}
          <div className="relative w-64 h-64 flex items-center justify-center bg-[#F7F8F0]/50 rounded-2xl border-2 border-[#355872]/5 overflow-hidden">
            {/* We use CSS transform here for instant preview speed */}
            <img
              src={image}
              alt="Preview"
              className="max-w-full max-h-full transition-transform duration-300 ease-in-out shadow-lg"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleRotate}
              className="flex-1 bg-white border-2 border-[#355872]/10 text-[#355872] px-6 py-4 rounded-2xl font-black hover:bg-[#F7F8F0] hover:border-[#355872]/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw className="w-5 h-5" /> Rotate 90°
            </button>

            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="flex-[2] bg-[#355872] text-[#F7F8F0] px-6 py-4 rounded-2xl font-black hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#355872]/20"
            >
              {isProcessing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Download
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
