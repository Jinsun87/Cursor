import { GoogleAuth } from "google-auth-library";

export type ImageAspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "3:4";

export type ArtStylePreset = "biblical-classical" | "history-epic" | "cinematic-realistic" | "none";

export interface GenerateImageOptions {
  prompt: string;
  projectId?: string;
  region?: string;
  negativePrompt?: string;
  aspectRatio?: ImageAspectRatio;
  sampleCount?: number;
  stylePreset?: ArtStylePreset;
  personGeneration?: "ALLOW_ADULT" | "ALLOW_ALL" | "DONT_ALLOW";
  safetySetting?: "block_medium_and_above" | "block_low_and_above" | "block_only_high";
}

export interface GeneratedImage {
  buffer: Buffer;
  mimeType: string;
}

export const STYLE_PRESETS: Record<Exclude<ArtStylePreset, "none">, string> = {
  "biblical-classical":
    "Dramatic classical oil painting, chiaroscuro lighting, rich textures, historic biblical reverence, fine art masterpiece, Rembrandt and Caravaggio inspired, museum quality, epic composition, dignified rendering, no modern elements, no text, no captions, no watermarks",
  "history-epic":
    "Cinematic historic realism, dramatic lighting, detailed period-accurate clothing and architecture, high dynamic range, fine art painting style, no modern artifacts, no text",
  "cinematic-realistic":
    "Ultra-high resolution cinematic realism, golden hour lighting, authentic historical atmosphere, photorealistic depth of field, 8k, highly detailed, masterwork",
};

/**
 * Builds the final prompt combining subject description and art style preset
 */
export function buildArtPrompt(subjectPrompt: string, preset: ArtStylePreset = "biblical-classical"): string {
  if (preset === "none" || !STYLE_PRESETS[preset]) {
    return subjectPrompt;
  }
  return `${subjectPrompt}. Style: ${STYLE_PRESETS[preset]}.`;
}

export function getVertexEndpoint(
  projectId: string,
  location: string,
  model = "gemini-3.1-flash-image",
): string {
  const host = !location || location === "global" ? "aiplatform.googleapis.com" : `${location}-aiplatform.googleapis.com`;
  return `https://${host}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;
}

/**
 * Generates an image using Vertex AI's Gemini Image model (gemini-3.1-flash-image)
 */
export async function generateVertexImage(options: GenerateImageOptions): Promise<GeneratedImage[]> {
  const projectId = options.projectId || process.env.GCP_PROJECT_ID || "nascar-auto";
  const location = options.region || process.env.VERTEX_LOCATION || "global";
  const model = process.env.VERTEX_MODEL || "gemini-3.1-flash-image";

  const finalPrompt = buildArtPrompt(options.prompt, options.stylePreset ?? "biblical-classical");

  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const accessToken = tokenResponse.token;

  if (!accessToken) {
    throw new Error("Unable to obtain Google Cloud access token. Check your GCP credentials or ADC configuration.");
  }

  const endpoint = getVertexEndpoint(projectId, location, model);

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: finalPrompt }],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
    },
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vertex AI API error (${response.status} ${response.statusText}): ${errorText}`);
  }

  const data = (await response.json()) as any;
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData?.data);

  if (!imagePart) {
    throw new Error("Vertex AI returned no image data in candidates.");
  }

  return [
    {
      buffer: Buffer.from(imagePart.inlineData.data, "base64"),
      mimeType: imagePart.inlineData.mimeType || "image/png",
    },
  ];
}
