import React from "react";
import BackToToolbox from "../ui/BackToToolbox";

interface PageShellProps {
  children: React.ReactNode;
  navToggle: React.ReactNode;
  title: string;
  description: string;
}

export default function PageShell({
  children,
  navToggle,
  title,
  description,
}: PageShellProps) {
  return (
    <div className="w-full pt-4 px-4">
      <BackToToolbox />

      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-4 tracking-tight text-[#355872]">
          {title}
        </h1>
        <p className="text-lg text-[#355872]/70 font-bold max-w-xl mx-auto">
          {description}
        </p>
      </div>

      <div className="flex justify-center mb-12">{navToggle}</div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
        {children}
      </div>
    </div>
  );
}
