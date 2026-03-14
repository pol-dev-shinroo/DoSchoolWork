"use client";

import { useEffect } from "react";

// ADDED: warningMessage parameter
export function useProcessingWarning(
  isProcessing: boolean,
  warningMessage: string,
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleInternalNavigate = (e: MouseEvent) => {
      if (!isProcessing) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor && anchor.href && !anchor.hasAttribute("download")) {
        e.preventDefault();
        e.stopPropagation();

        // UPDATED: Use the translated message
        alert(warningMessage);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleInternalNavigate, {
      capture: true,
    });

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleInternalNavigate, {
        capture: true,
      });
    };
  }, [isProcessing, warningMessage]); // <-- ADDED dependency
}
