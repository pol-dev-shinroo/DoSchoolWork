"use client";

import React, { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
} from "docx";
import PageShell from "@/components/layouts/PageShell";
import ConvertNav from "@/components/nav/ConvertNav";
import { useLanguage } from "@/context/LanguageContext";

import PdfToWordUpload from "@/components/ui/PdfToWordUpload";
import PdfToWordWorkspace from "@/components/ui/PdfToWordWorkspace";

// ==========================================
// 1. STRICT INTERFACES & TYPES
// ==========================================

type HighlightColor =
  | "yellow"
  | "black"
  | "blue"
  | "cyan"
  | "darkBlue"
  | "darkCyan"
  | "darkGray"
  | "darkGreen"
  | "darkMagenta"
  | "darkRed"
  | "darkYellow"
  | "green"
  | "lightGray"
  | "magenta"
  | "none"
  | "red"
  | "white"
  | undefined;

interface PdfAnnotation {
  subtype?: string;
  annotationType?: number;
  rect: number[];
  color?: number[];
}

interface PdfTextStyle {
  fontFamily: string;
  ascent: number;
  descent: number;
  vertical?: boolean;
}

interface PDFOperatorList {
  fnArray: number[];
  argsArray: unknown[][];
}

interface PDFViewport {
  width: number;
  height: number;
  scale: number;
  convertToViewportPoint: (x: number, y: number) => [number, number];
}

interface PDFPageProxy {
  getViewport: (params: { scale: number }) => PDFViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFViewport;
  }) => { promise: Promise<void> };
  getOperatorList: () => Promise<PDFOperatorList>;
  getTextContent: () => Promise<{
    items: unknown[];
    styles: Record<string, PdfTextStyle>;
  }>;
  getAnnotations: () => Promise<PdfAnnotation[]>;
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
}

interface PDFJSLib {
  OPS: Record<string, number>;
  getDocument: (params: { data: ArrayBuffer }) => { promise: Promise<unknown> };
  GlobalWorkerOptions: { workerSrc: string };
  version: string;
}

interface PdfTextItem {
  str: string;
  transform: number[];
  width?: number;
  fontName?: string;
  color?: number[] | Uint8ClampedArray;
  fillStyle?: string;
}

interface ParsedWord {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  clusterY: number;
  pageIndex: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  highlight?: HighlightColor;
}

interface FormattedBlock {
  text: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  highlight?: HighlightColor;
}

interface ParsedLine {
  blocks: FormattedBlock[];
  text: string;
  y: number;
  rightEdge: number;
  leftEdge: number;
  pageIndex: number;
  alignment: string;
}

// ==========================================
// 2. HELPER FUNCTIONS & MATH
// ==========================================

const rgbToHex = (r: number, g: number, b: number): string => {
  return [r, g, b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

const extractHexColorFallback = (item: PdfTextItem): string => {
  if (item.fillStyle && item.fillStyle.startsWith("#")) {
    return item.fillStyle.replace("#", "").toUpperCase();
  }
  if (item.color && item.color.length >= 3) {
    return Array.from(item.color)
      .slice(0, 3)
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }
  return "000000";
};

const isOverlapping = (
  wordX: number,
  wordY: number,
  wordW: number,
  wordH: number,
  rect: number[],
): boolean => {
  if (!rect || rect.length < 4) return false;
  const [minX, minY, maxX, maxY] = rect;

  const wMinX = wordX;
  const wMaxX = wordX + wordW;
  const wMinY = wordY - wordH * 0.2;
  const wMaxY = wordY + wordH;

  return wMinX <= maxX && wMaxX >= minX && wMinY <= maxY && wMaxY >= minY;
};

async function extractVectorGraphics(page: PDFPageProxy, pdfjsLib: PDFJSLib) {
  const ops = await page.getOperatorList();
  const OPS = pdfjsLib.OPS;

  const vectorHighlights: number[][] = [];
  const vectorUnderlines: number[][] = [];

  let currentFill: number[] = [0, 0, 0];
  let ctm: number[] = [1, 0, 0, 1, 0, 0];
  const ctmStack: number[][] = [];
  let currentRects: number[][] = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    const args = ops.argsArray[i] as number[];

    if (fn === OPS.save) {
      ctmStack.push([...ctm]);
    } else if (fn === OPS.restore) {
      ctm = ctmStack.pop() || [1, 0, 0, 1, 0, 0];
    } else if (fn === OPS.transform) {
      const [a, b, c, d, e, f] = args;
      ctm = [
        ctm[0] * a + ctm[2] * b,
        ctm[1] * a + ctm[3] * b,
        ctm[0] * c + ctm[2] * d,
        ctm[1] * c + ctm[3] * d,
        ctm[0] * e + ctm[2] * f + ctm[4],
        ctm[1] * e + ctm[3] * f + ctm[5],
      ];
    } else if (fn === OPS.setFillRGBColor) {
      currentFill = args;
    } else if (fn === OPS.rectangle) {
      currentRects.push(args);
    } else if (fn === OPS.fill || fn === OPS.eoFill) {
      currentRects.forEach((rect) => {
        const [x, y, w, h] = rect;
        const pts = [
          [x, y],
          [x + w, y],
          [x, y + h],
          [x + w, y + h],
        ].map((p) => [
          p[0] * ctm[0] + p[1] * ctm[2] + ctm[4],
          p[0] * ctm[1] + p[1] * ctm[3] + ctm[5],
        ]);

        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const height = maxY - minY;

        const isYellowish =
          currentFill[0] > 180 && currentFill[1] > 180 && currentFill[2] < 100;
        const isCyanish =
          currentFill[0] < 100 && currentFill[1] > 180 && currentFill[2] > 180;
        const isDark =
          currentFill[0] < 80 && currentFill[1] < 80 && currentFill[2] < 80;

        if ((isYellowish || isCyanish) && height > 5) {
          vectorHighlights.push([minX, minY, maxX, maxY]);
        } else if (isDark && height > 0.5 && height < 3.5) {
          vectorUnderlines.push([minX, minY, maxX, maxY]);
        }
      });
      currentRects = [];
    } else if (fn === OPS.stroke) {
      currentRects = [];
    }
  }

  return { vectorHighlights, vectorUnderlines };
}

// ==========================================
// 3. CORE OPTICAL ENGINE
// ==========================================

async function extractWordsFromPdf(
  pdf: PDFDocumentProxy,
  pdfjsLib: PDFJSLib,
  setProgress: (msg: string) => void,
): Promise<ParsedWord[]> {
  const allWords: ParsedWord[] = [];
  const numPages = pdf.numPages;

  const RENDER_SCALE = 2.0;

  for (let i = 1; i <= numPages; i++) {
    setProgress(
      `Extracting Page ${i} of ${numPages} (Optical Canvas Sampling)...`,
    );
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas not supported");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const pagePixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const textContent = await page.getTextContent();
    const fontStyles = textContent.styles || {};

    const annotations = await page.getAnnotations();
    const { vectorHighlights, vectorUnderlines } = await extractVectorGraphics(
      page,
      pdfjsLib,
    );

    const annotationHighlights = annotations
      .filter(
        (a: PdfAnnotation) =>
          a.subtype === "Highlight" || a.annotationType === 8,
      )
      .map((a: PdfAnnotation) => a.rect);
    const annotationUnderlines = annotations
      .filter(
        (a: PdfAnnotation) =>
          a.subtype === "Underline" || a.annotationType === 9,
      )
      .map((a: PdfAnnotation) => a.rect);

    const allHighlights = [...annotationHighlights, ...vectorHighlights];
    const allUnderlines = [...annotationUnderlines, ...vectorUnderlines];

    const pageWords: ParsedWord[] = [];

    textContent.items.forEach((item: unknown) => {
      const textItem = item as PdfTextItem;
      const cleanText = textItem.str.replace(
        /[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g,
        "",
      );

      if (cleanText.length === 0) return;

      const realFontObj = fontStyles[textItem.fontName || ""];
      const rawFontName =
        (realFontObj ? realFontObj.fontFamily : textItem.fontName) || "";

      // FIX 1: Run Regex on the clean font name so subset tags (like +B) don't create false positives,
      // but real tags (like MalgunGothic-Bold) are caught!
      const rawCleanFontFamily = rawFontName.split("+").pop() || "Arial";
      const lowerCleanFont = rawCleanFontFamily.toLowerCase();
      const isRegexBold =
        /bold|black|heavy|weight|-bd|bd-|w7|w8|w9|demi|\-b$|_b$|\bb\b/i.test(
          lowerCleanFont,
        );
      const isRegexItalic = /italic|oblique|-it|it-/i.test(lowerCleanFont);

      const cleanFontFamily = rawCleanFontFamily
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/-|,|Bold|Italic/gi, "")
        .trim();

      const [ptX, ptY] = viewport.convertToViewportPoint(
        textItem.transform[4],
        textItem.transform[5],
      );

      const fontSize = Math.abs(textItem.transform[3]);
      const fontHeightPx = fontSize * RENDER_SCALE;
      const fontWidthPx =
        (textItem.width || Math.abs(textItem.transform[0])) * RENDER_SCALE;

      const startX = Math.floor(ptX);
      const startY = Math.floor(ptY);
      const h = Math.floor(fontHeightPx);
      const w = Math.floor(fontWidthPx);

      const boxTop = Math.max(0, startY - h);
      const boxBottom = Math.min(
        canvas.height - 1,
        startY + Math.floor(h * 0.3),
      );
      const boxLeft = Math.max(0, startX);
      const boxRight = Math.min(canvas.width - 1, startX + w);

      let darkCount = 0,
        rSum = 0,
        gSum = 0,
        bSum = 0;
      let bgCount = 0,
        bgR = 0,
        bgG = 0,
        bgB = 0;
      let underlineStripDarkCount = 0;

      const underlineStripY = startY + Math.max(1, Math.floor(h * 0.08));

      if (w > 0 && h > 0) {
        for (let py = boxTop; py <= boxBottom; py++) {
          for (let px = boxLeft; px <= boxRight; px++) {
            const idx = (py * canvas.width + px) * 4;
            const r = pagePixels[idx];
            const g = pagePixels[idx + 1];
            const b = pagePixels[idx + 2];

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            if (lum < 160) {
              darkCount++;
              rSum += r;
              gSum += g;
              bSum += b;

              if (py >= underlineStripY && py <= underlineStripY + 2) {
                underlineStripDarkCount++;
              }
            } else if (lum > 180) {
              bgCount++;
              bgR += r;
              bgG += g;
              bgB += b;
            }
          }
        }
      }

      let hexColor = extractHexColorFallback(textItem);
      if (darkCount > 0) {
        const avgR = Math.round(rSum / darkCount);
        const avgG = Math.round(gSum / darkCount);
        const avgB = Math.round(bSum / darkCount);
        hexColor = rgbToHex(avgR, avgG, avgB);
        if (avgR < 50 && avgG < 50 && avgB < 50) hexColor = "000000";
      }

      let optHighlight: HighlightColor = undefined;
      if (bgCount > 0) {
        const avgBgR = Math.round(bgR / bgCount);
        const avgBgG = Math.round(bgG / bgCount);
        const avgBgB = Math.round(bgB / bgCount);

        if (avgBgR > 200 && avgBgG > 200 && avgBgB < 150)
          optHighlight = "yellow";
        else if (avgBgR < 150 && avgBgG > 200 && avgBgB > 200)
          optHighlight = "cyan";
        else if (avgBgR > 200 && avgBgG < 150 && avgBgB > 200)
          optHighlight = "magenta";
        else if (avgBgR > 150 && avgBgG > 200 && avgBgB < 150)
          optHighlight = "green";
      }

      for (const rect of allHighlights) {
        if (
          isOverlapping(
            textItem.transform[4],
            textItem.transform[5],
            textItem.width || fontSize,
            fontSize,
            rect,
          )
        ) {
          optHighlight = "yellow";
          break;
        }
      }

      let isOptUnderline = underlineStripDarkCount > w * 0.4;
      if (!isOptUnderline) {
        for (const rect of allUnderlines) {
          if (
            isOverlapping(
              textItem.transform[4],
              textItem.transform[5],
              textItem.width || fontSize,
              fontSize,
              rect,
            )
          ) {
            isOptUnderline = true;
            break;
          }
        }
      }

      // FIX 2: Font Size Scaling for Optical Bold Detection
      // Large fonts (like Titles > 14pt) naturally have more proportional white space in their boxes.
      // So we dynamically lower the ink density requirement for large text!
      const textArea = w * h;
      const inkDensity = textArea > 0 ? darkCount / textArea : 0;
      const densityThreshold = fontSize > 14 ? 0.26 : 0.34;
      const isOptBold =
        inkDensity > densityThreshold && cleanText.trim().length > 1;

      pageWords.push({
        text: cleanText,
        x: textItem.transform[4],
        y: textItem.transform[5],
        width: textItem.width || fontSize,
        height: fontSize,
        clusterY: 0,
        pageIndex: i,
        isBold: isOptBold || isRegexBold,
        isItalic: isRegexItalic,
        isUnderline: isOptUnderline,
        fontSize: fontSize,
        fontFamily: cleanFontFamily,
        color: hexColor,
        highlight: optHighlight,
      });
    });

    const yClusters: number[] = [];
    pageWords.forEach((word) => {
      const cluster = yClusters.find(
        (y) => Math.abs(y - word.y) < word.height * 0.4,
      );
      if (cluster !== undefined) word.clusterY = cluster;
      else {
        yClusters.push(word.y);
        word.clusterY = word.y;
      }
    });

    allWords.push(...pageWords);
  }
  return allWords;
}

// ==========================================
// 4. PARAGRAPH ASSEMBLY
// ==========================================

function assembleLines(words: ParsedWord[]): ParsedLine[] {
  const lines: ParsedLine[] = [];
  let currentLineWords: ParsedWord[] = [];
  let currentLineY = -9999;
  let currentPage = -1;

  const pushCompletedLine = () => {
    if (currentLineWords.length === 0) return;
    currentLineWords.sort((a, b) => a.x - b.x);

    const blocks: FormattedBlock[] = [];
    currentLineWords.forEach((word, index) => {
      let prefix = "";
      if (index > 0) {
        const prev = currentLineWords[index - 1];
        const physicalGap = word.x - (prev.x + prev.width);

        if (physicalGap > word.height * 0.12) prefix = " ";
      }

      const lastBlock = blocks[blocks.length - 1];
      const isJustSpace = word.text.trim().length === 0;

      if (lastBlock) {
        if (isJustSpace) {
          lastBlock.text += prefix + word.text;
        } else if (
          lastBlock.isBold === word.isBold &&
          lastBlock.isItalic === word.isItalic &&
          lastBlock.isUnderline === word.isUnderline &&
          lastBlock.fontSize === word.fontSize &&
          lastBlock.fontFamily === word.fontFamily &&
          lastBlock.color === word.color &&
          lastBlock.highlight === word.highlight
        ) {
          lastBlock.text += prefix + word.text;
        } else {
          if (prefix) {
            lastBlock.text += prefix;
          }
          blocks.push({
            text: word.text,
            isBold: word.isBold,
            isItalic: word.isItalic,
            isUnderline: word.isUnderline,
            fontSize: word.fontSize,
            fontFamily: word.fontFamily,
            color: word.color,
            highlight: word.highlight,
          });
        }
      } else {
        blocks.push({
          text: prefix + word.text,
          isBold: word.isBold,
          isItalic: word.isItalic,
          isUnderline: word.isUnderline,
          fontSize: word.fontSize,
          fontFamily: word.fontFamily,
          color: word.color,
          highlight: word.highlight,
        });
      }
    });

    lines.push({
      blocks,
      text: blocks.map((b) => b.text).join(""),
      y: currentLineY,
      rightEdge:
        currentLineWords[currentLineWords.length - 1].x +
        currentLineWords[currentLineWords.length - 1].width,
      leftEdge: currentLineWords[0].x,
      pageIndex: currentPage,
      alignment: AlignmentType.LEFT as string,
    });
  };

  words.forEach((word) => {
    if (word.clusterY === currentLineY && word.pageIndex === currentPage) {
      currentLineWords.push(word);
    } else {
      pushCompletedLine();
      currentLineWords = [word];
      currentLineY = word.clusterY;
      currentPage = word.pageIndex;
    }
  });
  pushCompletedLine();

  return lines;
}

async function createDocxBlob(lines: ParsedLine[]): Promise<Blob> {
  const maxRightEdge = Math.max(...lines.map((l) => l.rightEdge));
  const minLeftEdge = Math.min(...lines.map((l) => l.leftEdge));
  const pageWidth = maxRightEdge - minLeftEdge;

  lines.forEach((line) => {
    const leftMargin = line.leftEdge - minLeftEdge;
    const rightMargin = maxRightEdge - line.rightEdge;

    if (
      leftMargin > pageWidth * 0.15 &&
      Math.abs(leftMargin - rightMargin) < pageWidth * 0.1
    ) {
      line.alignment = AlignmentType.CENTER as string;
    } else if (leftMargin > pageWidth * 0.4 && rightMargin < pageWidth * 0.3) {
      line.alignment = AlignmentType.RIGHT as string;
    } else {
      line.alignment = AlignmentType.LEFT as string;
    }
  });

  const lineGaps = lines
    .map((l, i) =>
      i > 0 && l.pageIndex === lines[i - 1].pageIndex
        ? Math.abs(lines[i - 1].y - l.y)
        : 0,
    )
    .filter((g) => g > 5);
  lineGaps.sort((a, b) => a - b);
  const medianGap =
    lineGaps.length > 0 ? lineGaps[Math.floor(lineGaps.length / 2)] : 15;
  const PARAGRAPH_TOLERANCE = medianGap * 1.4;

  const paragraphs: Paragraph[] = [];
  let currentParagraphBlocks: FormattedBlock[] = [];
  let currentAlignment = AlignmentType.LEFT as string;
  let currentIndent = 0;
  let currentSpacingBefore = 0;
  let incomingPageBreak = false;

  const flushParagraph = () => {
    const hasText = currentParagraphBlocks.some(
      (b) => b.text.trim().length > 0,
    );

    if (currentParagraphBlocks.length > 0) {
      const paragraphChildren: (TextRun | PageBreak)[] = [];

      if (hasText && incomingPageBreak) {
        paragraphChildren.push(new PageBreak());
      }

      paragraphChildren.push(
        ...currentParagraphBlocks.map(
          (b) =>
            new TextRun({
              text: b.text,
              bold: b.isBold,
              italics: b.isItalic,
              underline: b.isUnderline ? { type: "single" } : undefined,
              size: b.fontSize * 2,
              font: b.fontFamily,
              color: b.color !== "000000" ? b.color : undefined,
              highlight: b.highlight,
            }),
        ),
      );

      paragraphs.push(
        new Paragraph({
          children: paragraphChildren,
          alignment: currentAlignment as "left" | "center" | "right" | "both",
          indent: currentIndent > 0 ? { firstLine: currentIndent } : undefined,
          spacing: {
            line: Math.round(medianGap * 20),
            lineRule: "exact",
            before: currentSpacingBefore > 0 ? currentSpacingBefore : undefined,
          },
        }),
      );
      currentParagraphBlocks = [];
      currentIndent = 0;
      currentSpacingBefore = 0;
      incomingPageBreak = false;
    }
  };

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    const prevLine = j > 0 ? lines[j - 1] : null;
    let isNewParagraph = false;
    let spacingBeforeToApply = 0;
    let triggersPageBreak = false;

    const leftOffset = line.leftEdge - minLeftEdge;
    const isIndented =
      leftOffset > pageWidth * 0.03 && line.alignment === "left";

    if (prevLine) {
      const alignmentChanged = line.alignment !== prevLine.alignment;

      if (line.pageIndex !== prevLine.pageIndex) {
        const isManualPageBreak = prevLine.y > 150;
        const prevEndedEarly =
          maxRightEdge - prevLine.rightEdge > pageWidth * 0.35;
        const endsWithPunctuation = /[.!?:"']$/.test(prevLine.text.trim());

        isNewParagraph =
          isIndented ||
          alignmentChanged ||
          (prevEndedEarly && endsWithPunctuation) ||
          isManualPageBreak;

        if (isManualPageBreak) {
          triggersPageBreak = true;
        }
      } else {
        const verticalGap = Math.abs(prevLine.y - line.y);
        const gapIsLarge = verticalGap > PARAGRAPH_TOLERANCE;

        const emptySpaceRatio = (maxRightEdge - prevLine.rightEdge) / pageWidth;
        const prevEndedExtremelyEarly = emptySpaceRatio > 0.5;
        const prevEndedEarly = emptySpaceRatio > 0.35;
        const endsWithTerminalPunctuation = /[.!?:"']$/.test(
          prevLine.text.trim(),
        );
        const isHardBreak =
          prevEndedExtremelyEarly ||
          (prevEndedEarly && endsWithTerminalPunctuation);

        isNewParagraph =
          gapIsLarge || isIndented || alignmentChanged || isHardBreak;

        if (gapIsLarge && verticalGap > medianGap * 1.3) {
          spacingBeforeToApply = Math.round((verticalGap - medianGap) * 20);
        }
      }
    } else {
      if (isIndented) isNewParagraph = true;
    }

    if (isNewParagraph || j === 0) {
      flushParagraph();
      if (triggersPageBreak) incomingPageBreak = true;
      currentAlignment = line.alignment;

      if (isIndented) {
        currentIndent = Math.round(leftOffset * 20);
      }
      currentSpacingBefore = spacingBeforeToApply;
    }

    line.blocks.forEach((block, index) => {
      const lastBlock =
        currentParagraphBlocks[currentParagraphBlocks.length - 1];

      if (lastBlock) {
        if (index === 0 && !isNewParagraph && j > 0) {
          if (
            !lastBlock.text.endsWith(" ") &&
            !lastBlock.text.endsWith("-") &&
            !block.text.startsWith(" ")
          ) {
            lastBlock.text += " ";
          }
        }

        if (
          lastBlock.isBold === block.isBold &&
          lastBlock.isItalic === block.isItalic &&
          lastBlock.isUnderline === block.isUnderline &&
          lastBlock.fontSize === block.fontSize &&
          lastBlock.fontFamily === block.fontFamily &&
          lastBlock.color === block.color &&
          lastBlock.highlight === block.highlight
        ) {
          lastBlock.text += block.text;
        } else {
          currentParagraphBlocks.push({ ...block });
        }
      } else {
        currentParagraphBlocks.push({ ...block });
      }
    });
  }
  flushParagraph();

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });
  return await Packer.toBlob(doc);
}

// ==========================================
// 5. REACT COMPONENT
// ==========================================

export default function PdfToWordClient() {
  const { t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setProgressStatus("");
  };

  const generateWord = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressStatus("Initializing Engine...");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await pdfjsLib.getDocument({ data: arrayBuffer })
        .promise) as unknown as PDFDocumentProxy;

      const words = await extractWordsFromPdf(
        pdf,
        pdfjsLib as unknown as PDFJSLib,
        setProgressStatus,
      );
      if (words.length === 0)
        throw new Error("No text found. Document might be scanned.");

      setProgressStatus("Assembling Lines & Structure...");
      const lines = assembleLines(words);

      setProgressStatus("Typesetting Final Word Document...");
      const docxBlob = await createDocxBlob(lines);

      const link = document.createElement("a");
      link.href = URL.createObjectURL(docxBlob);
      link.download = `DoSchoolWork_${file.name.replace(".pdf", "")}.docx`;
      link.click();
    } catch (error) {
      console.error("Error generating Word doc:", error);
      const msg =
        error instanceof Error ? error.message : "Something went wrong.";
      alert(`Conversion failed: ${msg}`);
    } finally {
      setIsProcessing(false);
      setProgressStatus("");
    }
  };

  return (
    <PageShell
      title={t.pdfToWord?.title || "PDF to Word"}
      description={
        t.pdfToWord?.description ||
        "Convert PDF documents to editable Word files."
      }
      navToggle={<ConvertNav active="pdf-to-word" />}
    >
      <div className="max-w-xl mx-auto p-10 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 transition-all">
        {!file ? (
          <PdfToWordUpload onFileChange={handleFileChange} />
        ) : (
          <PdfToWordWorkspace
            fileName={file.name}
            isProcessing={isProcessing}
            progressStatus={progressStatus}
            onClear={handleClear}
            onConvert={generateWord}
          />
        )}
      </div>
    </PageShell>
  );
}
