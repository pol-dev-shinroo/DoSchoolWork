import type { Metadata } from "next";
import ImageResizeClient from "./ImageResizeClient";

export const metadata: Metadata = {
  title: "Image Resizer | DoSchoolWork",
  description: "Quickly resize photos for submission without losing quality.",
};

export default function ResizePage() {
  return <ImageResizeClient />;
}
