"use client";

import { useEffect } from "react";

export function useProcessingWarning(isProcessing: boolean) {
  useEffect(() => {
    // 1. Protects against closing the tab, refreshing, or typing a new URL
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = ""; // Triggers browser's native warning
      }
    };

    // 2. Protects against clicking Next.js internal <Link> components
    const handleInternalNavigate = (e: MouseEvent) => {
      if (!isProcessing) return;

      const target = e.target as HTMLElement;
      // Check if the click happened on or inside an anchor <a> tag
      const anchor = target.closest("a");

      // If it's a link, has an href, and is NOT a download link (like your export buttons)
      if (anchor && anchor.href && !anchor.hasAttribute("download")) {
        e.preventDefault(); // Stop Next.js from routing
        e.stopPropagation(); // Stop the click dead in its tracks

        // Throw our own custom alert
        alert(
          "Please wait until the current file finishes processing before changing pages.",
        );
      }
    };

    // Listen for tab closes
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Listen for all clicks globally using the "capture" phase so we intercept it before Next.js does
    document.addEventListener("click", handleInternalNavigate, {
      capture: true,
    });

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleInternalNavigate, {
        capture: true,
      });
    };
  }, [isProcessing]);
}
