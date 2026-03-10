"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 1. Read the user's actual browser language settings
    const userLang =
      navigator.language ||
      (navigator.languages && navigator.languages[0]) ||
      "";
    const isKorean = userLang.toLowerCase().includes("ko");

    // 2. Instantly push them to the correct URL
    if (isKorean) {
      router.replace("/ko");
    } else {
      router.replace("/en");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F0]/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#355872]/20 border-t-[#355872] rounded-full animate-spin" />
        <p className="font-bold text-[#355872] text-sm tracking-widest uppercase">
          Loading HisPDF...
        </p>
      </div>
    </div>
  );
}
