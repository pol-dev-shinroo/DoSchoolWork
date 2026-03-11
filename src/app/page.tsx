"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 1. Read the user's actual browser language settings
    const userLang = navigator.language.toLowerCase();

    // 2. Instantly push them to the correct URL based on our 8 languages
    if (userLang.includes("ko")) router.replace("/ko");
    else if (userLang.includes("zh")) router.replace("/zh");
    else if (userLang.includes("de")) router.replace("/de");
    else if (userLang.includes("ru")) router.replace("/ru");
    else if (userLang.includes("el")) router.replace("/el");
    else if (userLang.includes("km")) router.replace("/km");
    else if (userLang.includes("id") || userLang.includes("in"))
      router.replace("/id");
    else router.replace("/en"); // Default fallback
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8F0]/30">
      {/* Just a sleek, minimal spinner without the text so it feels instantaneous */}
      <div className="w-8 h-8 border-4 border-[#355872]/20 border-t-[#355872] rounded-full animate-spin" />
    </div>
  );
}
