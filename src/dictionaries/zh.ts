import { Dictionary } from "./en";

export const zh: Dictionary = {
  common: {
    backToToolbox: "返回工具箱",
    soon: "即将推出",
    processingWarning: "请等待当前文件处理完毕后再切换页面。",
  },
  header: {
    freeNoLogin: "免费，免登录",
  },
  sidebar: {
    pdf: "整理",
    img: "图像",
    convert: "转换",
    mp3: "音频",
  },
  home: {
    heroTitle: "HisPDF",
    featureFree: "免费",
    featureNoLogin: "无需注册或订阅",
    featureLocal: "隐私安全。不保存任何数据。",
    comingSoonTitle: "更多工具即将推出",
    comingSoonDesc: "压缩、保护、编辑",
  },
  pdfMerge: {
    title: "合并 PDF",
    description:
      "将多个 PDF 文件合并为一个文档。直接在浏览器中重新排序并合并 PDF。",
  },
  pdfCrop: {
    title: "裁剪 PDF",
    description: "裁剪 PDF 页面，删除边距，并从 PDF 文档中提取特定部分。",
    errors: {
      invalidFileType: "文件类型无效。请上传有效的 PDF 文档。",
      loadError: "加载 PDF 时出错。文件可能已损坏或受密码保护。",
      startGreaterThanEnd: "起始页不能大于结束页。",
      processError: "出现问题！请确保文件未受密码保护。",
    },
  },
  imageCrop: {
    title: "裁剪图像",
    description: "裁剪图像文件并删除背景。支持 JPG、PNG 和 WEBP 格式。",
  },
  imageResize: {
    title: "调整图像大小",
    description: "调整图像尺寸并修改文档和网页使用的宽高比。",
  },
  imageRotate: {
    title: "旋转图像",
    description: "旋转图像并直接在设备上修复扫描文档的方向。",
  },
  pdfToWord: {
    title: "PDF 转 Word",
    description:
      "将 PDF 转换为 Word。从 PDF 中提取文本并保存为可编辑的 Word 文档格式。",
  },
  ocrPdf: {
    title: "OCR PDF",
    description:
      "使扫描的 PDF 文档可搜索。应用光学字符识别 (OCR) 来复制和突出显示文本。",
    pageLimitConfirm:
      "此文件有 {{count}} 页。为了确保快速处理，我们一次最多处理 50 页。\n\n您想使用我们的拆分工具来分割您的文档吗？",
  },
  imageToPdf: {
    title: "图像转 PDF",
    description:
      "将 JPG、PNG 和 WEBP 图像转换为 PDF。将多个图像合并为标准的 A4 PDF 文档。",
  },
  wordToPdf: {
    title: "Word 转 PDF",
    description:
      "将 Word 文档转换为 PDF 格式。保护您的文本文件以供打印和共享。",
  },
  epubToPdf: {
    title: "EPUB 转 PDF",
    description:
      "将 EPUB 电子书转换为 PDF。通过准确的分页将数字书籍格式化为可打印的 PDF 文档。",
    workspaceTitle: "上传 EPUB 文件",
    workspaceDesc: "选择一个 .epub 文件开始转换过程。",
    workspaceButton: "选择 EPUB 文件",
    convertButton: "转换为 PDF",
  },
  mp3ToPdf: {
    title: "MP3 转 PDF",
    description:
      "将 MP3 音频文件转录为文本。将讲座和语音笔记转换为可读的 PDF 文档。",
    workspaceTitle: "上传音频文件",
    workspaceDesc: "选择一个 .mp3 或 .wav 文件开始转录。",
    workspaceButton: "选择音频文件",
  },
};
