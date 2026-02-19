import PDFCropper from "@/components/PDFCropper";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <section className="text-center mb-10">
        <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-900">
          Crop Your PDF. <span className="text-blue-600">Instantly.</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          The safest way for students to split assignments. <br /> 100% private,
          browser-based processing.
        </p>
      </section>

      <PDFCropper />
    </div>
  );
}
