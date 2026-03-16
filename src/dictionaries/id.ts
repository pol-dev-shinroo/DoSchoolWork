import { Dictionary } from "./en";

export const id: Dictionary = {
  common: {
    backToToolbox: "Kembali ke Alat",
    soon: "SEGERA",
    processingWarning:
      "Harap tunggu hingga file saat ini selesai diproses sebelum berpindah halaman.",
  },
  header: {
    freeNoLogin: "Gratis, Tanpa Login",
  },
  sidebar: {
    pdf: "Atur",
    img: "Gambar",
    convert: "Konversi",
    mp3: "Audio",
  },
  home: {
    heroTitle: "HisPDF",
    featureFree: "Gratis",
    featureNoLogin: "Tanpa Daftar atau Langganan",
    featureLocal: "Privasi terjamin. Tidak ada data yang disimpan.",
    comingSoonTitle: "Alat Lainnya Segera Hadir",
    comingSoonDesc: "Kompres, Lindungi, Edit",
  },
  pdfMerge: {
    title: "Gabungkan PDF",
    description:
      "Gabungkan beberapa file PDF menjadi satu dokumen. Susun ulang halaman dan gabungkan PDF langsung di browser Anda.",
  },
  pdfCrop: {
    title: "Pisahkan PDF",
    description:
      "Pisahkan halaman PDF, hapus margin, dan ekstrak bagian tertentu dari dokumen PDF Anda.",
    errors: {
      invalidFileType:
        "Jenis file tidak valid. Harap unggah dokumen PDF yang valid.",
      loadError:
        "Kesalahan memuat PDF. File mungkin rusak atau dilindungi kata sandi.",
      startGreaterThanEnd:
        "Halaman awal tidak boleh lebih besar dari halaman akhir.",
      processError:
        "Terjadi kesalahan! Pastikan file tidak dilindungi kata sandi.",
    },
  },
  imageCrop: {
    title: "Potong Gambar",
    description:
      "Potong file gambar dan hapus latar belakang. Mendukung format JPG, PNG, dan WEBP.",
  },
  imageResize: {
    title: "Ubah Ukuran Gambar",
    description:
      "Ubah dimensi gambar dan sesuaikan rasio aspek untuk dokumen dan penggunaan web.",
  },
  imageRotate: {
    title: "Putar Gambar",
    description:
      "Putar gambar dan perbaiki orientasi dokumen hasil scan secara lokal di perangkat Anda.",
  },
  pdfToWord: {
    title: "PDF ke Word",
    description:
      "Konversi PDF ke Word. Ekstrak teks dari PDF Anda ke dalam format dokumen Word yang dapat diedit.",
  },
  ocrPdf: {
    title: "OCR PDF",
    description:
      "Buat dokumen PDF hasil scan dapat dicari. Terapkan pengenalan karakter optik (OCR) untuk menyalin teks.",
    pageLimitConfirm:
      "File ini memiliki {{count}} halaman. Untuk memastikan pemrosesan yang cepat, kami menangani maksimal 50 halaman sekaligus.\n\nApakah Anda ingin menggunakan alat Pisahkan untuk membagi dokumen Anda?",
  },
  imageToPdf: {
    title: "Gambar ke PDF",
    description:
      "Konversi gambar JPG, PNG, dan WEBP ke PDF. Gabungkan beberapa gambar menjadi dokumen PDF A4 standar.",
  },
  wordToPdf: {
    title: "Word ke PDF",
    description:
      "Konversi dokumen Word ke format PDF. Amankan file teks Anda untuk dicetak dan dibagikan.",
  },
  epubToPdf: {
    title: "EPUB ke PDF",
    description:
      "Konversi ebook EPUB ke PDF. Format buku digital Anda menjadi dokumen PDF siap cetak dengan penomoran halaman yang akurat.",
    workspaceTitle: "Unggah File EPUB",
    workspaceDesc: "Pilih file .epub untuk memulai proses konversi.",
    workspaceButton: "Pilih File EPUB",
    convertButton: "Konversi ke PDF",
  },
  mp3ToPdf: {
    title: "MP3 ke PDF",
    description:
      "Transkripsi file audio MP3 ke teks. Konversi kuliah dan catatan suara menjadi dokumen PDF yang dapat dibaca.",
    workspaceTitle: "Unggah File Audio",
    workspaceDesc: "Pilih file .mp3 atau .wav untuk memulai transkripsi.",
    workspaceButton: "Pilih File Audio",
  },
};
