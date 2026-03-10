import type { Metadata } from "next";
import ImageResizeClient from "./ImageResizeClient";

export const metadata: Metadata = {
  title: "Image Resizer | DoSchoolWork",
  description: "Quickly resize photos for submission without losing quality.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function ResizePage() {
  return <ImageResizeClient />;
}
