"use client";

import React, { useState } from "react";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";
import ePub from "epubjs";

import EpubToPdfUpload from "@/components/ui/EpubToPdfUpload";
import EpubToPdfWorkspace from "@/components/ui/EpubToPdfWorkspace";

export default function EpubToPdfClient() {
  const { t } = useLanguage();

  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setEpubFile(selectedFile);
    e.target.value = "";
  };

  const removeFile = () => {
    setEpubFile(null);
  };

  const handleConvert = async () => {
    if (!epubFile) return;
    setIsProcessing(true);

    let epubWrapper: HTMLDivElement | null = null;
    let printIframe: HTMLIFrameElement | null = null;

    try {
      setProgressStatus("Extracting book contents...");

      const arrayBuffer = await epubFile.arrayBuffer();
      const book = ePub(arrayBuffer);
      await book.ready;

      // Invisible epubjs extraction wrapper
      epubWrapper = document.createElement("div");
      epubWrapper.style.position = "fixed";
      epubWrapper.style.top = "0";
      epubWrapper.style.left = "-9999px";
      epubWrapper.style.width = "800px";
      epubWrapper.style.visibility = "hidden";
      epubWrapper.style.opacity = "0";
      epubWrapper.style.pointerEvents = "none";
      document.body.appendChild(epubWrapper);

      const rendition = book.renderTo(epubWrapper, {
        width: 800,
        flow: "scrolled-doc",
        manager: "default",
      });

      // Native Print Iframe
      printIframe = document.createElement("iframe");
      printIframe.style.position = "fixed";
      printIframe.style.left = "-9999px";
      printIframe.style.bottom = "0";
      printIframe.style.width = "0";
      printIframe.style.height = "0";
      printIframe.style.border = "none";
      printIframe.style.visibility = "hidden";
      printIframe.style.opacity = "0";
      printIframe.style.pointerEvents = "none";
      document.body.appendChild(printIframe);

      const printDoc = printIframe.contentDocument;
      if (!printDoc) throw new Error("Could not initialize print engine.");

      const printStyle = printDoc.createElement("style");
      printStyle.innerHTML = `
        @page { 
          size: A4 portrait; 
          margin: 20mm; 
        }
        body { 
          font-family: Georgia, serif; 
          color: #000 !important; 
          background: #fff !important; 
          line-height: 1.6; 
          padding: 0; 
          margin: 0; 
        }
        .chapter { 
          break-before: page; 
          page-break-before: always; 
        }
        p, li, blockquote { 
          orphans: 3; 
          widows: 3; 
          break-inside: avoid; 
          page-break-inside: avoid; 
        }
        h1, h2, h3, h4, h5, h6 { 
          break-after: avoid; 
          page-break-after: avoid; 
        }
        img, svg, table, figure { 
          max-width: 100% !important; 
          height: auto !important; 
          break-inside: avoid; 
          page-break-inside: avoid; 
        }
        a { color: inherit; text-decoration: none; }
      `;
      printDoc.head.appendChild(printStyle);

      const spine = book.spine as unknown as {
        spineItems: Array<{ href: string }>;
      };
      const spineItems = spine.spineItems;

      for (let i = 0; i < spineItems.length; i++) {
        // ==========================================
        // THE PERCENTAGE FIX
        // Calculate and display a clean 0-100% value
        // ==========================================
        const percent = Math.round(((i + 1) / spineItems.length) * 100);
        setProgressStatus(`Processing... ${percent}%`);

        const item = spineItems[i];
        await rendition.display(item.href);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const iframe = epubWrapper.querySelector(
          "iframe",
        ) as HTMLIFrameElement | null;
        if (!iframe || !iframe.contentDocument?.body) continue;

        if (i === 0) {
          const styles = iframe.contentDocument.head.querySelectorAll(
            'style, link[rel="stylesheet"]',
          );
          styles.forEach((styleNode) => {
            printDoc.head.appendChild(styleNode.cloneNode(true));
          });
        }

        const chapterDiv = printDoc.createElement("div");
        if (i > 0) chapterDiv.className = "chapter";
        chapterDiv.innerHTML = iframe.contentDocument.body.innerHTML;
        printDoc.body.appendChild(chapterDiv);
      }

      setProgressStatus("Opening Print Engine...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      printIframe.contentWindow?.focus();
      printIframe.contentWindow?.print();
    } catch (error) {
      console.error(error);
      alert(
        "Error converting EPUB. Please try again or check if the file is DRM protected.",
      );
    } finally {
      if (epubWrapper && document.body.contains(epubWrapper))
        document.body.removeChild(epubWrapper);
      setTimeout(() => {
        if (printIframe && document.body.contains(printIframe))
          document.body.removeChild(printIframe);
      }, 60000);
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

  return (
    <PageShell
      title={t.epubToPdf.title}
      description={t.epubToPdf.description}
      navToggle={<ConvertNav active="epub-to-pdf" />}
    >
      <div className="max-w-2xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8">
        {!epubFile ? (
          <EpubToPdfUpload onFileChange={handleFileChange} />
        ) : (
          <EpubToPdfWorkspace
            fileName={epubFile.name}
            isProcessing={isProcessing}
            progressStatus={progressStatus}
            onClear={removeFile}
            onConvert={handleConvert}
          />
        )}
      </div>
    </PageShell>
  );
}
