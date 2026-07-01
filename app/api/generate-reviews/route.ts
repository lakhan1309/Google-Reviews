import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateReviews, hasLlmConfigured } from "@/lib/ai";
import { generateMockReviews, shouldUseMockReviews } from "@/lib/mock-reviews";
import { checkRateLimit } from "@/lib/rate-limit";
import { createReviewEvent, getBusinessBySlug } from "@/lib/store";

const bodySchema = z.object({
  slug: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const body = bodySchema.parse(await request.json());

    if (!checkRateLimit(`${ip}:${body.slug}`)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const business = await getBusinessBySlug(body.slug);

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const useMock = shouldUseMockReviews();

    if (!useMock && !hasLlmConfigured()) {
      return NextResponse.json(
        { error: "Review generation is not configured" },
        { status: 503 }
      );
    }

    const reviews = useMock
      ? generateMockReviews({
          name: business.name,
          category: business.category,
          rating: body.rating,
        })
      : await generateReviews({
          name: business.name,
          category: business.category,
          services: business.services,
          rating: body.rating,
        });

    const event = await createReviewEvent(business.id, body.rating);

    return NextResponse.json({ reviews, eventId: event.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.error("generate-reviews error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate reviews. Please try again.",
        reason: message,
      },
      { status: 500 }
    );
  }
}
