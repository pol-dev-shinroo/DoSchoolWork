import {
  pipeline,
  env,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.13/dist/transformers.js";

env.allowLocalModels = false;
let transcriber = null;

self.addEventListener("message", async (event) => {
  const { audio } = event.data;

  try {
    if (!transcriber) {
      self.postMessage({ status: "initiate" });

      const isWebGPUAvailable = "gpu" in navigator;
      const targetDevice = isWebGPUAvailable ? "webgpu" : "wasm";

      self.postMessage({
        status: "info",
        text: `Hardware Check: Using ${targetDevice.toUpperCase()} Engine`,
      });

      transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
        {
          device: targetDevice,
          progress_callback: (data) => {
            if (data.status === "progress") {
              self.postMessage({
                status: "progress",
                progress: Math.round((data.loaded / data.total) * 100),
              });
            }
          },
        },
      );

      self.postMessage({ status: "model_ready" });
    }

    const totalAudioDuration = audio.length / 16000;

    // FIX 3: Let the user know why it's silent before the first chunk completes!
    self.postMessage({
      status: "info",
      text: `Audio Duration: ${Math.round(totalAudioDuration)} seconds.`,
    });
    self.postMessage({
      status: "info",
      text: "Compiling WebGPU Shaders (This takes 1-3 mins on the first run)...",
    });

    const output = await transcriber(audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true,
      chunk_callback: (chunk) => {
        if (chunk && chunk.timestamp) {
          const currentTime = chunk.timestamp[1] || chunk.timestamp[0];
          const percentComplete = Math.min(
            100,
            Math.round((currentTime / totalAudioDuration) * 100),
          );

          self.postMessage({
            status: "transcribe_progress",
            progress: percentComplete,
          });
        }
      },
      callback_function: (beams) => {
        const decodedText = transcriber.tokenizer.decode(
          beams[0].output_token_ids,
          { skip_special_tokens: true },
        );
        self.postMessage({ status: "update", text: decodedText });
      },
    });

    const finalText =
      output.text && output.text.trim().length > 0
        ? output.text
        : "[No speech detected or audio was completely silent]";

    self.postMessage({
      status: "complete",
      chunks: output.chunks || [],
      text: finalText,
    });
  } catch (err) {
    console.error("Worker Error:", err);
    self.postMessage({
      status: "error",
      text: err.message || "Failed to initialize AI Engine.",
    });
  }
});
