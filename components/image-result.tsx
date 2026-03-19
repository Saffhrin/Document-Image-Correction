"use client";

import { Download, FileText, Clock, Zap, FileImage, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualityScore {
  clarity: number;
  contrast: number;
  noiseReduction: number;
  overall: number;
}

interface ImageResultProps {
  processedImage: string;
  metadata: {
    width: number;
    height: number;
    format: string;
    processingTimeMs: number;
    qualityScore: QualityScore;
    documentType: string;
  };
  extractedText?: string;
  isExtractingText?: boolean;
}

export function ImageResult({
  processedImage,
  metadata,
  extractedText,
  isExtractingText,
}: ImageResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `processed-document.${metadata.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
    }
  };

  return (
    <div className="space-y-6">
      {/* Processed Image */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Processed Result</h3>
          <button
            onClick={handleDownload}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors",
              "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
        <div className="relative aspect-[4/3] w-full bg-secondary/50">
          <img
            src={processedImage}
            alt="Processed document"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Processing Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Processing Time</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            {metadata.processingTimeMs}
            <span className="text-sm font-normal text-muted-foreground ml-1">ms</span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileImage className="w-4 h-4" />
            <span className="text-xs font-medium">Dimensions</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            {metadata.width}
            <span className="text-sm font-normal text-muted-foreground mx-1">x</span>
            {metadata.height}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Type className="w-4 h-4" />
            <span className="text-xs font-medium">Document Type</span>
          </div>
          <p className="text-sm font-bold text-foreground truncate" title={metadata.documentType}>
            {metadata.documentType}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">Quality Score</span>
          </div>
          <p className="text-xl font-bold text-accent">
            {metadata.qualityScore.overall}
            <span className="text-sm font-normal text-muted-foreground ml-1">/ 100</span>
          </p>
        </div>
      </div>

      {/* Quality Breakdown */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="text-sm font-semibold text-foreground mb-4">Quality Analysis</h4>
        <div className="space-y-3">
          {[
            { label: "Clarity", value: metadata.qualityScore.clarity },
            { label: "Contrast Improvement", value: metadata.qualityScore.contrast },
            { label: "Noise Reduction", value: metadata.qualityScore.noiseReduction },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Text */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-semibold text-foreground">Extracted Text (OCR)</h4>
          </div>
          {extractedText && (
            <button
              onClick={handleCopyText}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              Copy Text
            </button>
          )}
        </div>
        <div className="p-4 max-h-[300px] overflow-y-auto">
          {isExtractingText ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Extracting text...</span>
              </div>
            </div>
          ) : extractedText ? (
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {extractedText}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No text extracted yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
