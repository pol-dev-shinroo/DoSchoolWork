// 1. IMPORT DIRECTLY FROM THE CDN (This fixes the silent crash)
import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

// Skip local model checks
env.allowLocalModels = false;

// DEBUG: Log that the worker is alive
console.log("[Worker] Worker script loaded and ready from CDN.");

class PipelineSingleton {
  static task = "automatic-speech-recognition";
  static model = "Xenova/whisper-tiny";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      console.log("[Worker] Pipeline initializing... downloading model?");
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
      console.log("[Worker] Pipeline ready.");
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  console.log("[Worker] Message received from Main Thread", event.data);

  try {
    const transcriber = await PipelineSingleton.getInstance((x) => {
      // Pass download progress back to UI
      self.postMessage(x);
    });

    // Check if we actually got audio data
    if (!event.data.audio) {
      console.error("[Worker] Error: No audio data received!");
      throw new Error("No audio data sent to worker");
    }

    console.log(
      `[Worker] Starting transcription on audio array (Length: ${event.data.audio.length})`,
    );

    const output = await transcriber(event.data.audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: "english",
      task: "transcribe",
      callback_function: (x) => {
        console.log("[Worker] Partial result:", x[0].text);
        self.postMessage({
          status: "update",
          text: x[0].text,
        });
      },
    });

    console.log("[Worker] Transcription Complete:", output.text);

    self.postMessage({
      status: "complete",
      text: output.text,
    });
  } catch (err) {
    console.error("[Worker] CRITICAL ERROR:", err);
    self.postMessage({
      status: "error",
      text: "Worker Error: " + err.message,
    });
  }
});
