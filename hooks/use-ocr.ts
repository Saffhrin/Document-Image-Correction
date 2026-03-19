"use client";

import { useState, useCallback } from "react";
import { createWorker, Worker } from "tesseract.js";

interface OCRState {
  isLoading: boolean;
  progress: number;
  text: string | null;
  error: string | null;
}

export function useOCR() {
  const [state, setState] = useState<OCRState>({
    isLoading: false,
    progress: 0,
    text: null,
    error: null,
  });

  const extractText = useCallback(async (imageUrl: string) => {
    setState({
      isLoading: true,
      progress: 0,
      text: null,
      error: null,
    });

    let worker: Worker | null = null;

    try {
      worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setState((prev) => ({
              ...prev,
              progress: Math.round(m.progress * 100),
            }));
          }
        },
      });

      const result = await worker.recognize(imageUrl);

      setState({
        isLoading: false,
        progress: 100,
        text: result.data.text.trim() || "No text detected in the image.",
        error: null,
      });

      return result.data.text.trim();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to extract text";
      setState({
        isLoading: false,
        progress: 0,
        text: null,
        error: errorMessage,
      });
      return null;
    } finally {
      if (worker) {
        await worker.terminate();
      }
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      progress: 0,
      text: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    extractText,
    reset,
  };
}
