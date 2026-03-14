export const en = {
  // ==========================================
  // GLOBAL UI ELEMENTS
  // ==========================================
  common: {
    backToToolbox: "Back to Toolbox",
    soon: "SOON",
    processingWarning:
      "Please wait until the current file finishes processing before changing pages.",
  },
  header: {
    freeNoLogin: "Free, No Login",
  },
  sidebar: {
    pdf: "Organize",
    img: "IMG",
    convert: "Convert",
    mp3: "Audio",
  },

  // ==========================================
  // PAGES
  // ==========================================
  home: {
    heroTitle: "HisPDF",
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
    title: "Merge PDF",
    description:
      "Combine multiple PDF files into a single document. Reorder pages and merge PDFs directly in your browser.",
  },
  pdfCrop: {
    title: "Split PDF",
    description:
      "Split PDF pages, remove margins, and extract specific sections from your PDF documents.",
  },

  // ==========================================
  // TOOLS: IMAGE
  // ==========================================
  imageCrop: {
    title: "Crop Image",
    description:
      "Crop image files and remove backgrounds. Supports JPG, PNG, and WEBP formats.",
  },
  imageResize: {
    title: "Resize Image",
    description:
      "Resize image dimensions and adjust aspect ratios for documents and web use.",
  },
  imageRotate: {
    title: "Rotate Image",
    description:
      "Rotate images and fix the orientation of scanned documents locally on your device.",
  },

  // ==========================================
  // TOOLS: CONVERT
  // ==========================================
  pdfToWord: {
    title: "PDF to Word",
    description:
      "Convert PDF to Word. Extract text from your PDF into an editable Word document format.",
  },
  ocrPdf: {
    title: "OCR PDF",
    description:
      "Make scanned PDF documents searchable. Apply Optical Character Recognition (OCR) to copy and highlight text.",
    pageLimitConfirm:
      "This file has {{count}} pages. To ensure fast processing, we handle a maximum of 50 pages at once.\n\nWould you like to use our Split tool to divide your document?",
  },
  imageToPdf: {
    title: "Image to PDF",
    description:
      "Convert JPG, PNG, and WEBP images to PDF. Combine multiple images into a standard A4 PDF document.",
  },
  wordToPdf: {
    title: "Word to PDF",
    description:
      "Convert Word documents to PDF format. Secure your text files for printing and sharing.",
  },
  epubToPdf: {
    title: "EPUB to PDF",
    description:
      "Convert EPUB ebooks to PDF. Format your digital books into print-ready PDF documents with accurate pagination.",
    workspaceTitle: "Upload EPUB File",
    workspaceDesc: "Select an .epub file to begin the conversion process.",
    workspaceButton: "Select EPUB File",
    convertButton: "Convert to PDF",
  },

  // ==========================================
  // TOOLS: AUDIO (Hidden for MVP)
  // ==========================================
  mp3ToPdf: {
    title: "MP3 to PDF",
    description:
      "Transcribe MP3 audio files to text. Convert lectures and voice notes into readable PDF documents.",
    workspaceTitle: "Upload Audio File",
    workspaceDesc: "Select an .mp3 or .wav file to begin transcription.",
    workspaceButton: "Select Audio File",
  },
};

export type Dictionary = typeof en;
