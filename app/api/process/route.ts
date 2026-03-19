import { NextRequest, NextResponse } from "next/server";
import { processImage, validateImage, ProcessingOptions } from "@/lib/image-processor";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Get processing options from form data
    const options: ProcessingOptions = {
      grayscale: formData.get("grayscale") === "true",
      denoise: formData.get("denoise") !== "false",
      sharpen: formData.get("sharpen") !== "false",
      contrastEnhancement: formData.get("contrastEnhancement") !== "false",
      shadowCorrection: formData.get("shadowCorrection") !== "false",
      autoLevel: formData.get("autoLevel") !== "false",
    };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image
    const validation = await validateImage(buffer);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Process image
    const result = await processImage(buffer, options);

    // Convert processed image to base64 for response
    const base64Image = result.processedImage.toString("base64");

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process image" },
      { status: 500 }
    );
  }
}
