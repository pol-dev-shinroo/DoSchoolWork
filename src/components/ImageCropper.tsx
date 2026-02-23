"use client";
import { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // Required for the crop UI to show up!
import { Download, Image as ImageIcon, Trash2, Scissors } from "lucide-react";

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setFileName(file.name);
      // Reset crop states for new image
      setCrop(undefined);
      setCompletedCrop(null);
    }
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

    // Calculate the scale between the actual image size and the visually scaled down preview
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the exact size of the cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Turn off image smoothing for a crisper cut
    ctx.imageSmoothingQuality = "high";

    // Draw the sliced portion onto our hidden canvas
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

    // Export the canvas to a file
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

  return (
    <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
      {/* Hidden Canvas Element for processing */}
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
            <Scissors className="w-12 h-12 text-[#355872]" />
          </div>
          <p className="font-black text-2xl text-[#355872]">Upload Image</p>
          <p className="text-sm text-[#7AAACE] mt-2 font-bold uppercase tracking-widest">
            JPG, PNG, WebP supported
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 items-center">
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

          {/* Interactive Crop Area */}
          <div className="bg-[#F7F8F0]/50 p-2 rounded-2xl border-2 border-[#355872]/5 w-full overflow-hidden flex justify-center items-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-[500px]" // Prevents massive images from blowing out the screen
            >
              <img
                ref={imageRef}
                alt="Crop me"
                src={imageSrc}
                className="max-w-full max-h-[500px] object-contain shadow-lg rounded-lg"
              />
            </ReactCrop>
          </div>

          <button
            onClick={handleDownload}
            disabled={
              isProcessing || !completedCrop?.width || !completedCrop?.height
            }
            className="w-full bg-[#355872] text-[#F7F8F0] px-6 py-5 rounded-2xl font-black text-lg hover:bg-[#7AAACE] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#355872]/20 disabled:opacity-30 disabled:grayscale"
          >
            {isProcessing ? (
              <span>Slicing image...</span>
            ) : (
              <>
                <Download className="w-6 h-6" /> Crop & Download
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
