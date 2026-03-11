import React from "react";
import PageShell from "@/components/layouts/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      description="How HisPDF protects your data and privacy."
      navToggle={<></>}
    >
      <div className="max-w-3xl mx-auto p-8 md:p-12 border-4 border-double border-[#355872]/20 rounded-[3rem] bg-white shadow-xl shadow-[#355872]/5 mt-8 text-[#355872]">
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-black mb-4">
            1. The &quot;Local-First&quot; Guarantee
          </h2>
          <p className="mb-6 leading-relaxed">
            HisPDF is designed from the ground up to respect your privacy. All
            PDF modifications—including Optical Character Recognition (OCR),
            merging, and resizing—are executed{" "}
            <strong>100% locally on your device&apos;s browser</strong>. We do
            not upload, process, or store your documents on any external
            servers. Once you close your browser tab, your files are gone.
          </p>

          <h2 className="text-2xl font-black mb-4">
            2. Data Collection & Analytics
          </h2>
          <p className="mb-6 leading-relaxed">
            We do not use invasive tracking cookies or third-party analytics
            (like Google Analytics) to track your behavior across the web. Our
            hosting provider (Cloudflare) may collect standard, anonymized
            server logs (such as general geographic region or browser type)
            strictly for security and anti-DDoS purposes.
          </p>

          <h2 className="text-2xl font-black mb-4">
            3. Feedback Chatbot System
          </h2>
          <p className="mb-6 leading-relaxed">
            If you choose to use our feedback chatbot, the text you submit is
            sent securely to our database. This system is completely anonymous.
            We do not collect your IP address, name, or browser fingerprint
            alongside your feedback. Please do not submit personal or sensitive
            information through the feedback form.
          </p>

          <h2 className="text-2xl font-black mb-4">4. Third-Party Services</h2>
          <p className="mb-6 leading-relaxed">
            Certain tools (like the OCR engine) download necessary language
            processing models (via Tesseract.js) to your device to function.
            These downloads are standard static files and do not transmit your
            personal data back to any third party.
          </p>

          <hr className="my-8 border-t-2 border-dashed border-[#355872]/20" />

          <h2 className="text-2xl font-black mb-4">
            5. Contact & Legal Notice (Impressum)
          </h2>
          <p className="mb-2 leading-relaxed">
            HisPDF is an independent, non-commercial project developed and
            maintained by:
          </p>
          <ul className="list-none p-0 mb-6 space-y-2 font-bold bg-[#F7F8F0] p-4 rounded-xl border border-[#355872]/10 inline-block">
            <li>Creator: Jaehyuk Kim</li>
            <li>Email: jaehyukkim1996@gmail.com</li>
            <li>Location: South Korea</li>
          </ul>
          <p className="text-sm opacity-70">Last updated: March 2026</p>
        </div>
      </div>
    </PageShell>
  );
}
