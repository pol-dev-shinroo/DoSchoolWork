import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoSchoolWork | Free PDF Crop Tool",
  description: "Fast, private, and free PDF cropping for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <nav className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
          <span className="text-xl font-extrabold text-blue-600">
            DoSchoolWork
          </span>
          <div className="space-x-4 text-sm font-bold">
            <span className="text-blue-600">Crop</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 cursor-not-allowed">
              Merge (Soon)
            </span>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="p-8 text-center text-xs font-medium text-slate-400">
          © 2026 DoSchoolWork. Files are processed locally. No data is stored on
          our servers.
        </footer>
      </body>
    </html>
  );
}
