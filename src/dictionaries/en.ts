export const en = {
  // ==========================================
  // GLOBAL UI ELEMENTS
  // ==========================================
  common: {
    backToToolbox: "Back to Toolbox",
    soon: "SOON",
  },
  header: {
    freeNoLogin: "Free, No Login",
  },
  sidebar: {
    pdf: "Organize", // Updated from "PDF"
    img: "IMG",
    convert: "Convert",
    mp3: "Audio",
  },

  // ==========================================
  // PAGES
  // ==========================================
  home: {
    heroTitle: "HisPDF.",
    featureFree: "Free",
    featureNoLogin: "No sign-up or subscription",
    featureLocal: "Privacy secured. Zero server uploads.",
    comingSoonTitle: "More Tools Soon",
    comingSoonDesc: "Compress, Protect, Edit",
  },

  // ==========================================
  // TOOLS: PDF
  // ==========================================
  pdfMerge: {
    title: "Merge PDF.",
    description:
      "Combine multiple files into one seamless document. Perfect for grouping separate pages.",
  },
  pdfCrop: {
    title: "Crop PDF.",
    description:
      "Extract specific pages or cut down margins from your documents instantly.",
  },

  // ==========================================
  // TOOLS: IMAGE
  // ==========================================
  imageCrop: {
    title: "Crop Image.",
    description:
      "Cut out the unnecessary background from your photos to make them look professional.",
  },
  imageResize: {
    title: "Resize Image.",
    description: "Perfect your aspect ratios for any document in one click.",
  },
  imageRotate: {
    title: "Rotate Image.",
    description:
      "Fix upside-down phone scans instantly. No server uploads, completely private.",
  },

  // ==========================================
  // TOOLS: CONVERT
  // ==========================================
  pdfToWord: {
    title: "PDF to Word.",
    description:
      "Need to edit a document? Extract the text from your PDF into a fully editable Word document in seconds.",
  },
  ocrPdf: {
    title: "OCR PDF.",
    description:
      "Make scanned documents searchable. We'll recognize the text so you can highlight, copy, and search it.",
  },
  imageToPdf: {
    title: "Image to PDF.",
    description:
      "Convert JPG, PNG, WEBP to PDF. Combine images. Private local processing.",
  },
  wordToPdf: {
    title: "Word to PDF.",
    description:
      "Lock your text files into secure PDFs. Completely private, processed directly in your browser.",
  },
  epubToPdf: {
    title: "EPUB to PDF.",
    description:
      "Convert your EPUB ebooks into readable PDF documents. Completely private, processed directly in your browser.",
    workspaceTitle: "Upload EPUB File",
    workspaceDesc: "Drop your .epub file here to start the conversion process.",
    workspaceButton: "Select EPUB File",
    convertButton: "Convert to PDF",
  },
  // ==========================================
  // TOOLS: AUDIO (Hidden for MVP, saved for later)
  // ==========================================
  mp3ToPdf: {
    title: "MP3 to PDF.",
    description:
      "Transcribe your audio lectures and voice notes into readable PDF study guides instantly.",
    workspaceTitle: "Upload Audio File",
    workspaceDesc:
      "Drop your .mp3 or .wav file here to start the transcription process.",
    workspaceButton: "Select Audio File",
  },
};

export type Dictionary = typeof en;
