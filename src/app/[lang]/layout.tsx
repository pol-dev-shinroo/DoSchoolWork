import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/context/LanguageContext";
import { seoDictionary, Locale } from "@/dictionaries/seo";

// 1. IMPORT YOUR NEW CHAT COMPONENT HERE
import FeedbackChat from "@/components/ui/FeedbackChat";

// NEXT.JS 16 FIX: Await the params for Global SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || "en";
  const dict = seoDictionary[lang]?.global || seoDictionary.en.global;

  return {
    title: dict.title,
    description: dict.description,
    keywords: dict.keywords,
  };
}

// THE FIX: Expanded to all 8 languages!
export function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "ko" },
    { lang: "zh" },
    { lang: "de" },
    { lang: "ru" },
    { lang: "el" },
    { lang: "km" },
    { lang: "id" },
  ];
}

// NEXT.JS 16 FIX: Make the layout async to await the params
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const currentLang = resolvedParams.lang || "en";

  return (
    <html lang={currentLang}>
      <body className="bg-[#F7F8F0]/30 text-slate-900 font-sans antialiased">
        <LanguageProvider>
          <Header />
          <Sidebar />
          <main className="min-h-screen pt-28 pb-20 px-4 md:pl-24 transition-all duration-300">
            {children}
          </main>

          {/* UPDATED FOOTER WITH LEGAL LINKS */}
          <footer className="md:pl-24 py-8 flex flex-col items-center justify-center gap-2 text-center text-[10px] font-bold text-[#355872]/40 uppercase tracking-widest">
            <p>© 2026 HisPDF. Files processed locally.</p>
            <div className="flex gap-4 mt-2">
              <a
                href={`/${currentLang}/privacy`}
                className="hover:text-[#7AAACE] transition-colors"
              >
                Privacy Policy & Impressum
              </a>
              <span className="opacity-50">•</span>
              <a
                href={`/${currentLang}/terms`}
                className="hover:text-[#7AAACE] transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </footer>

          {/* 2. ADD THE CHATBOT HERE SO IT FLOATS GLOBALLY */}
          <FeedbackChat />
        </LanguageProvider>
      </body>
    </html>
  );
}
