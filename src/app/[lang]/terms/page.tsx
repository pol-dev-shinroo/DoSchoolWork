import React from "react";
import PageShell from "@/components/layouts/PageShell";

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Service"
      description="Rules and guidelines for using HisPDF."
      navToggle={<></>}
    >
      <div className="max-w-3xl mx-auto p-8 md:p-12 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 text-[#355872]">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-black mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6 leading-relaxed">
            By accessing and using HisPDF, you agree to be bound by these Terms
            of Service. If you do not agree with any part of these terms, please
            do not use our tools.
          </p>

          <h2 className="text-2xl font-black mb-4">
            2. &quot;As-Is&quot; Service Disclaimer
          </h2>
          <p className="mb-6 leading-relaxed bg-[#9CD5FF]/20 p-4 rounded-xl border border-[#9CD5FF]/50 font-medium">
            HisPDF is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis. We make no warranties, expressed or implied,
            regarding the reliability, accuracy, or availability of the tools
            provided. Because processing happens locally on your device,
            performance may vary heavily based on your hardware.
          </p>

          <h2 className="text-2xl font-black mb-4">
            3. Limitation of Liability
          </h2>
          <p className="mb-6 leading-relaxed">
            Under no circumstances shall Jaehyuk Kim or HisPDF be held liable
            for any direct, indirect, incidental, or consequential damages
            resulting from the use or inability to use the service. This
            includes, but is not limited to, corrupted files, data loss, or
            system crashes.{" "}
            <strong>
              Always keep a backup of your original PDF files before processing
              them.
            </strong>
          </p>

          <h2 className="text-2xl font-black mb-4">4. Acceptable Use</h2>
          <p className="mb-6 leading-relaxed">
            You agree to use HisPDF strictly for lawful purposes. You may not
            use our systems (including the feedback chatbot) to transmit spam,
            malicious code, or abusive language. We reserve the right to block
            access to our services for any user violating these terms.
          </p>

          <h2 className="text-2xl font-black mb-4">5. Intellectual Property</h2>
          <p className="mb-6 leading-relaxed">
            The HisPDF branding, UI layout, and custom codebase are the
            intellectual property of the creator. The underlying open-source
            libraries (such as pdf-lib and Tesseract.js) remain under their
            respective licenses. You retain full ownership and copyright of any
            documents you process using our tool.
          </p>

          <hr className="my-8 border-t-2 border-dashed border-[#355872]/20" />

          <p className="text-sm opacity-70">
            Last updated: March 2026. These terms may be updated at any time
            without prior notice.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
