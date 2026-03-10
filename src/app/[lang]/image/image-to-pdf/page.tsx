import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF | HisPDF",
  description:
    "Convert JPG, PNG, WEBP to PDF. Combine images. Private local processing.",
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ko" }];
}

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
