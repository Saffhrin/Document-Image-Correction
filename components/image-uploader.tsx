"use client";

import { useCallback, useState } from "react";
import { Upload, Camera, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string | null;
}

export function ImageUploader({
  onImageSelect,
  isProcessing,
  error,
}: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const clearSelection = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
  }, []);

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFile(file);
      }
    };
    input.click();
  }, [handleFile]);

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg border border-border bg-card overflow-hidden">
          <div className="relative aspect-[4/3] w-full">
            <img
              src={preview}
              alt="Selected document"
              className="w-full h-full object-contain bg-secondary/50"
            />
          </div>
          <div className="flex items-center justify-between p-4 border-t border-border bg-card">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {selectedFile?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={clearSelection}
              disabled={isProcessing}
              className={cn(
                "p-2 rounded-md transition-colors",
                "bg-secondary hover:bg-secondary/80 text-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-all duration-200",
            "flex flex-col items-center justify-center p-8 min-h-[300px]",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/30",
            error && "border-destructive"
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={cn(
                "p-4 rounded-full",
                isDragActive ? "bg-primary/10" : "bg-secondary"
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? "Drop your document here" : "Upload Document Image"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, WebP, TIFF, BMP (max 10MB)
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <label
                className={cn(
                  "cursor-pointer px-4 py-2 rounded-md font-medium text-sm transition-colors",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Browse Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="sr-only"
                />
              </label>

              <button
                onClick={handleCameraCapture}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Camera className="w-4 h-4" />
                Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
