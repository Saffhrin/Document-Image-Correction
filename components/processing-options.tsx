"use client";

import { cn } from "@/lib/utils";

export interface ProcessingOptionsState {
  grayscale: boolean;
  denoise: boolean;
  sharpen: boolean;
  contrastEnhancement: boolean;
  shadowCorrection: boolean;
  autoLevel: boolean;
}

interface ProcessingOptionsProps {
  options: ProcessingOptionsState;
  onChange: (options: ProcessingOptionsState) => void;
  disabled?: boolean;
}

const optionLabels: Record<keyof ProcessingOptionsState, { label: string; description: string }> = {
  grayscale: {
    label: "Grayscale",
    description: "Convert to black and white",
  },
  denoise: {
    label: "Noise Removal",
    description: "Remove camera noise and artifacts",
  },
  sharpen: {
    label: "Sharpen Text",
    description: "Enhance text edges and clarity",
  },
  contrastEnhancement: {
    label: "Enhance Contrast",
    description: "Improve text visibility",
  },
  shadowCorrection: {
    label: "Shadow Correction",
    description: "Fix uneven lighting and shadows",
  },
  autoLevel: {
    label: "Auto Level",
    description: "Automatic brightness adjustment",
  },
};

export function ProcessingOptions({
  options,
  onChange,
  disabled,
}: ProcessingOptionsProps) {
  const toggleOption = (key: keyof ProcessingOptionsState) => {
    onChange({
      ...options,
      [key]: !options[key],
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Processing Options</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(optionLabels) as Array<keyof ProcessingOptionsState>).map((key) => (
          <button
            key={key}
            onClick={() => toggleOption(key)}
            disabled={disabled}
            className={cn(
              "flex items-start gap-3 p-3 rounded-md border transition-all text-left",
              "hover:border-primary/50",
              options[key]
                ? "bg-primary/5 border-primary"
                : "bg-secondary/30 border-border",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5",
                "border transition-colors",
                options[key]
                  ? "bg-primary border-primary"
                  : "bg-transparent border-muted-foreground"
              )}
            >
              {options[key] && (
                <svg
                  className="w-3 h-3 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {optionLabels[key].label}
              </span>
              <span className="text-xs text-muted-foreground">
                {optionLabels[key].description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
