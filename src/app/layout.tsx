import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DoSchoolWork | Free PDF & Image Tools",
  description: "Fast, private, and free PDF tools for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8F0]/30 text-slate-900 font-sans antialiased">
        {/* Global Header (Fixed to top) */}
        <Header />

        {/* Global Sidebar (Fixed to left) */}
        <Sidebar />

        {/* Global Main Wrapper 
          - pt-28: Pushes content down so it's not hidden behind the Header
          - md:pl-24: Pushes content right so it's not hidden behind the Sidebar
        */}
        <main className="min-h-screen pt-28 pb-20 px-4 md:pl-24 transition-all duration-300">
          {children}
        </main>

        <footer className="md:pl-24 py-8 text-center text-[10px] font-bold text-[#355872]/40 uppercase tracking-widest">
          © 2026 DoSchoolWork. Files processed locally.
        </footer>
      </body>
    </html>
  );
}
