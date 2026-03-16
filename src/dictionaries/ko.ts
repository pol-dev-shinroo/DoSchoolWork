import { Dictionary } from "./en";

export const ko: Dictionary = {
  // ==========================================
  // GLOBAL UI ELEMENTS
  // ==========================================
  common: {
    backToToolbox: "툴박스로 돌아가기",
    soon: "준비중",
    processingWarning:
      "현재 파일 처리가 완료될 때까지 페이지를 이동하지 마세요.",
  },
  header: {
    freeNoLogin: "무료, 로그인 없음",
  },
  sidebar: {
    pdf: "정리", // Updated from "PDF"
    img: "이미지",
    convert: "변환",
    mp3: "오디오",
  },

  // ==========================================
  // PAGES
  // ==========================================
  home: {
    heroTitle: "HisPDF.",
    featureFree: "무료",
    featureNoLogin: "가입 및 구독 없음",
    featureLocal: "프라이버시 보장. 데이터가 저장되지 않습니다.",
    comingSoonTitle: "더 많은 도구 준비중",
    comingSoonDesc: "압축, 보호, 편집",
  },

  // ==========================================
  // TOOLS: PDF
  // ==========================================
  pdfMerge: {
    title: "PDF 합치기.",
    description:
      "여러 파일을 하나의 매끄러운 문서로 합치세요. 개별 과제 페이지를 하나로 묶기에 완벽합니다.",
  },
  pdfCrop: {
    title: "PDF 나누기.",
    description: "pdf를 특정 페이지들로 나누거나, 여백을 잘라내세요.",
    errors: {
      invalidFileType:
        "잘못된 파일 형식입니다. 유효한 PDF 문서를 업로드해주세요.",
      loadError:
        "PDF를 불러오는 중 오류가 발생했습니다. 파일이 손상되었거나 암호로 보호되어 있을 수 있습니다.",
      startGreaterThanEnd: "시작 페이지가 끝 페이지보다 클 수 없습니다.",
      processError:
        "문제가 발생했습니다! 파일이 암호로 보호되어 있지 않은지 확인해주세요.",
    },
  },

  // ==========================================
  // TOOLS: IMAGE
  // ==========================================
  imageCrop: {
    title: "이미지 자르기.",
    description:
      "사진에서 불필요한 배경을 제거하여 전문적인 문서처럼 만드세요.",
  },
  imageResize: {
    title: "이미지 크기 조절.",
    description: "어떤 과제든 단 한 번의 클릭으로 완벽한 화면 비율을 맞추세요.",
  },
  imageRotate: {
    title: "이미지 회전.",
    description:
      "거꾸로 찍힌 스캔본을 즉시 수정하세요. 서버 업로드 없는 100% 로컬 처리.",
  },

  // ==========================================
  // TOOLS: CONVERT
  // ==========================================
  pdfToWord: {
    title: "PDF를 Word로.",
    description:
      "과제 수정이 필요하신가요? PDF에서 텍스트를 추출하여 편집 가능한 Word 문서로 즉시 변환하세요.",
  },
  ocrPdf: {
    title: "OCR PDF 스캔.",
    description:
      "스캔된 문서를 검색 가능하게 만듭니다. 텍스트를 인식하여 강조, 복사 및 검색이 가능해집니다.",
    pageLimitConfirm:
      "이 파일은 {{count}}페이지입니다. 빠르고 안정적인 처리를 위해 한 번에 최대 50페이지만 지원합니다.\n\nPDF 나누기 도구를 사용하여 문서를 분할하시겠습니까?",
  },
  imageToPdf: {
    title: "이미지 PDF 변환.",
    description: "JPG, PNG, WEBP 등 이미지 병합. 안전한 로컬 처리.",
  },
  wordToPdf: {
    title: "Word를 PDF로.",
    description:
      "에세이를 안전한 PDF로 고정하세요. 100% 개인정보 보호, 브라우저에서 직접 처리됩니다.",
  },
  epubToPdf: {
    title: "EPUB를 PDF로.",
    description:
      "EPUB 전자책을 읽기 편한 PDF 문서로 변환하세요. 서버 업로드 없이 브라우저에서 100% 로컬로 안전하게 처리됩니다.",
    workspaceTitle: "EPUB 파일 업로드",
    workspaceDesc: ".epub 파일을 여기에 드롭하여 변환을 시작하세요.",
    workspaceButton: "EPUB 파일 선택",
    convertButton: "PDF로 변환하기",
  },
  // TOOLS: AUDIO
  // ==========================================
  mp3ToPdf: {
    title: "MP3를 PDF로.",
    description:
      "오디오 강의와 음성 메모를 읽기 쉬운 PDF 학습 가이드로 즉시 변환하세요.",
    workspaceTitle: "오디오 파일 업로드",
    workspaceDesc: ".mp3 또는 .wav 파일을 여기에 드롭하여 변환을 시작하세요.",
    workspaceButton: "오디오 파일 선택",
  },
};
