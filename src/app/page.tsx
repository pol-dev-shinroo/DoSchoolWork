import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "DoSchoolWork | Free PDF & Image Tools for Students",
  description:
    "The ultimate 100% private, browser-based toolbox for your assignments. Crop PDFs, merge files, and rotate images for free.",
};

export default function HomePage() {
  return <HomeClient />;
}
