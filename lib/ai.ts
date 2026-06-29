import OpenAI from "openai";
import { z } from "zod";

const reviewsSchema = z.object({
  reviews: z.array(z.string()).length(3),
});

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return new OpenAI({ apiKey });
}

type GenerateReviewsInput = {
  name: string;
  category: string;
  services: string;
  rating: number;
};

export async function generateReviews(
  input: GenerateReviewsInput
): Promise<string[]> {
  const openai = getOpenAIClient();

  const prompt = `Business: ${input.name}
Category: ${input.category}
Services: ${input.services}
Rating: ${input.rating}/5

Generate exactly 3 short, natural-sounding Google review options a real customer might write.
Match the tone to the rating (1-2 = critical but fair, 3 = mixed, 4-5 = positive).
Each review should be 2-4 sentences, mention specific services where possible, and sound human — not generic or promotional.
Return JSON: { "reviews": ["...", "...", "..."] }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    throw new Error("No response from AI");
  }

  const parsed = reviewsSchema.parse(JSON.parse(content));
  return parsed.reviews;
}

export function getGoogleReviewUrl(googlePlaceId: string): string {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId)}`;
}
