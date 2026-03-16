"use client";

import { useEffect } from "react";

export default function ServerWarmup() {
  useEffect(() => {
    // Check if we already woke up the server during this browser session
    const isWarmedUp = sessionStorage.getItem("engine_warmed_up");

    if (!isWarmedUp) {
      // Send a silent background ping to your live Hugging Face root URL
      fetch("https://lewigolski-hispdf-engine.hf.space/")
        .then((response) => {
          if (response.ok) {
            console.log("[System] OCR Engine successfully warmed up.");
            // Mark it as done so it doesn't fire again while they navigate the site
            sessionStorage.setItem("engine_warmed_up", "true");
          }
        })
        .catch(() => {
          console.log("[System] Engine warmup ping skipped.");
        });
    }
  }, []);

  // This component renders absolutely nothing to the screen
  return null;
}
