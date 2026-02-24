import type { Metadata } from "next";
import ImageRotateClient from "./ImageRotateClient";

export const metadata: Metadata = {
  title: "Free Image Rotator | DoSchoolWork",
  description:
    "Fix upside-down scans instantly with our private, browser-based tool.",
};

export default function RotatePage() {
  return <ImageRotateClient />;
}
