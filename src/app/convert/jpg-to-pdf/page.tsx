import type { Metadata } from "next";
import JpgToPdfClient from "./JpgToPdfClient";

export const metadata: Metadata = {
  title: "Free JPG to PDF | DoSchoolWork",
  description:
    "Convert your assignment photos and images into a single PDF instantly.",
};

export default function JpgToPdfPage() {
  return <JpgToPdfClient />;
}
