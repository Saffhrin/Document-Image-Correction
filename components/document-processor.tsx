"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "./image-uploader";
import { ProcessingOptions, ProcessingOptionsState } from "./processing-options";
import { ImageResult } from "./image-result";
import { useOCR } from "@/hooks/use-ocr";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";

interface ProcessingMetadata {
  width: number;
  height: number;
  format: string;
  processingTimeMs: number;
  qualityScore: {
    clarity: number;
    contrast: number;
    noiseReduction: number;
    overall: number;
  };
  documentType: string;
}

interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  processedImage: string | null;
  metadata: ProcessingMetadata | null;
}

export function DocumentProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<ProcessingOptionsState>({
    grayscale: false,
    denoise: true,
    sharpen: true,
    contrastEnhancement: true,
    shadowCorrection: true,
    autoLevel: true,
  });
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    processedImage: null,
    metadata: null,
  });

  const {
    isLoading: isExtractingText,
    text: extractedText,
    extractText,
    reset: resetOCR,
  } = useOCR();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setProcessingState({
      isProcessing: false,
      error: null,
      processedImage: null,
      metadata: null,
    });
    resetOCR();
  }, [resetOCR]);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setProcessingState({
      isProcessing: true,
      error: null,
      processedImage: null,
      metadata: null,
    });
    resetOCR();

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("grayscale", String(options.grayscale));
      formData.append("denoise", String(options.denoise));
      formData.append("sharpen", String(options.sharpen));
      formData.append("contrastEnhancement", String(options.contrastEnhancement));
      formData.append("shadowCorrection", String(options.shadowCorrection));
      formData.append("autoLevel", String(options.autoLevel));

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      setProcessingState({
        isProcessing: false,
        error: null,
        processedImage: data.image,
        metadata: data.metadata,
      });

      // Automatically extract text from processed image
      if (data.image) {
        extractText(data.image);
      }
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        error: error instanceof Error ? error.message : "Failed to process image",
        processedImage: null,
        metadata: null,
      });
    }
  }, [selectedFile, options, extractText, resetOCR]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setProcessingState({
      isProcessing: false,
      error: null,
      processedImage: null,
      metadata: null,
    });
    resetOCR();
  }, [resetOCR]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
          Automatic Document Image Correction
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Upload your document photos and get professionally enhanced, readable images with 
          automatic text extraction powered by advanced OCR technology.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Upload and Options */}
        <div className="space-y-6">
          <ImageUploader
            onImageSelect={handleImageSelect}
            isProcessing={processingState.isProcessing}
            error={processingState.error}
          />

          {selectedFile && (
            <>
              <ProcessingOptions
                options={options}
                onChange={setOptions}
                disabled={processingState.isProcessing}
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={handleProcess}
                  disabled={processingState.isProcessing}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {processingState.isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Process Document
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {processingState.processedImage && (
                  <button
                    onClick={handleReset}
                    className={cn(
                      "px-4 py-3 rounded-lg font-medium transition-colors",
                      "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    Reset
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          {processingState.processedImage && processingState.metadata ? (
            <ImageResult
              processedImage={processingState.processedImage}
              metadata={processingState.metadata}
              extractedText={extractedText || undefined}
              isExtractingText={isExtractingText}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-2 p-8">
                <div className="p-4 rounded-full bg-secondary inline-block">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  Results will appear here
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Upload a document image and click "Process Document" to see the enhanced result
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-border">
        {[
          {
            title: "Noise Removal",
            description: "Eliminates camera noise and artifacts",
          },
          {
            title: "Shadow Correction",
            description: "Fixes uneven lighting and dark regions",
          },
          {
            title: "Text Enhancement",
            description: "Improves sharpness and readability",
          },
          {
            title: "OCR Extraction",
            description: "Extracts text using Tesseract.js",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-4 rounded-lg border border-border bg-card/50"
          >
            <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
