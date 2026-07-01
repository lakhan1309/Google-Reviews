import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { z } from "zod";

const reviewsSchema = z.object({
  reviews: z.array(z.string()).length(3),
});

export type LlmProvider = "openai" | "gemini";

type GenerateReviewsInput = {
  name: string;
  category: string;
  services: string;
  rating: number;
};

function isValidOpenAiKey(key?: string): key is string {
  return (
    !!key &&
    key.startsWith("sk-") &&
    key !== "sk-..." &&
    !key.includes("your-") &&
    key.length > 20
  );
}

function isValidGeminiKey(key?: string): key is string {
  return (
    !!key &&
    key.startsWith("AIza") &&
    !key.includes("your-gemini") &&
    key.length > 20
  );
}

function buildPrompt(input: GenerateReviewsInput): string {
  return `Business: ${input.name}
Category: ${input.category}
Services: ${input.services}
Rating: ${input.rating}/5

Generate exactly 3 short, natural-sounding Google review options a real customer might write.
Match the tone to the rating (1-2 = critical but fair, 3 = mixed, 4-5 = positive).
Each review should be 2-4 sentences, mention specific services where possible, and sound human — not generic or promotional.
Return JSON: { "reviews": ["...", "...", "..."] }`;
}

export function getLlmProvider(): LlmProvider | null {
  const configured = process.env.LLM_PROVIDER?.toLowerCase();
  const hasGemini = isValidGeminiKey(process.env.GEMINI_API_KEY);
  const hasOpenAi = isValidOpenAiKey(process.env.OPENAI_API_KEY);

  if (configured === "gemini") {
    return hasGemini ? "gemini" : null;
  }

  if (configured === "openai") {
    return hasOpenAi ? "openai" : null;
  }

  if (hasGemini) {
    return "gemini";
  }

  if (hasOpenAi) {
    return "openai";
  }

  return null;
}

export function hasLlmConfigured(): boolean {
  return getLlmProvider() !== null;
}

function parseReviews(content: string): string[] {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = (fenced?.[1] ?? trimmed).trim();
  const parsed = reviewsSchema.parse(JSON.parse(jsonText));
  return parsed.reviews;
}

async function generateWithOpenAI(input: GenerateReviewsInput): Promise<string[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!isValidOpenAiKey(apiKey)) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey });
  const prompt = buildPrompt(input);

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You help customers write honest Google reviews. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return parseReviews(content);
}

async function generateWithGemini(input: GenerateReviewsInput): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isValidGeminiKey(apiKey)) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });

  const prompt = `${buildPrompt(input)}

You help customers write honest Google reviews. Always respond with valid JSON only.`;

  const result = await model.generateContent(prompt);
  const content = result.response.text();

  if (!content) {
    throw new Error("No response from Gemini");
  }

  return parseReviews(content);
}

export async function generateReviews(
  input: GenerateReviewsInput
): Promise<string[]> {
  const provider = getLlmProvider();

  if (!provider) {
    throw new Error(
      "No LLM provider configured. Set a valid GEMINI_API_KEY or OPENAI_API_KEY."
    );
  }

  if (provider === "gemini") {
    return generateWithGemini(input);
  }

  return generateWithOpenAI(input);
}

export function getGoogleReviewUrl(googlePlaceId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId)}`;
}
