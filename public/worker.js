import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";

// Configuration for Browser Environment
env.allowLocalModels = false;
env.useBrowserCache = true; // Keeps the 40MB model saved so it doesn't re-download every time

console.log("[Worker] AI Engine Loaded.");

class PipelineSingleton {
  static task = "automatic-speech-recognition";
  static model = "Xenova/whisper-tiny";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      console.log("[Worker] Initializing AI Model...");

      try {
        // Attempt WebGPU for maximum speed (uses the student's graphics card)
        console.log("[Worker] Attempting to load via WebGPU...");
        this.instance = await pipeline(this.task, this.model, {
          progress_callback,
          device: "webgpu",
          dtype: "fp32",
        });
        console.log("[Worker] WebGPU Engine Ready!");
      } catch (err) {
        // Safe Fallback to CPU if WebGPU isn't supported
        console.warn(
          "[Worker] WebGPU failed, falling back to CPU (WASM).",
          err,
        );
        this.instance = await pipeline(this.task, this.model, {
          progress_callback,
          device: "wasm",
        });
        console.log("[Worker] CPU Engine Ready.");
      }
    }
    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  console.log("[Worker] Processing Audio...");

  try {
    // 1. Load the model and pass download progress back to the Terminal
    const transcriber = await PipelineSingleton.getInstance((x) => {
      self.postMessage(x);
    });

    // 2. Tell the Terminal the model is fully loaded and audio processing is beginning
    self.postMessage({ status: "model_ready" });

    if (!event.data.audio) {
      throw new Error("No audio data received");
    }

    // 3. Run the AI transcription
    const output = await transcriber(event.data.audio, {
      chunk_length_s: 30, // Processes in 30-second bursts
      stride_length_s: 5, // 5-second overlap so words don't get cut in half
      task: "transcribe",
      callback_function: (x) => {
        // 4. Send live, typing-style text updates back to the Terminal screen
        self.postMessage({
          status: "update",
          text: x[0].text,
        });
      },
    });

    // 5. Send final completed text
    self.postMessage({
      status: "complete",
      text: output.text,
    });
  } catch (err) {
    console.error("[Worker] Error:", err);
    self.postMessage({
      status: "error",
      text: err.message,
    });
  }
});
