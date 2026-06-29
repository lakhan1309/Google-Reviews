import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { markReviewEventCopied } from "@/lib/store";

const bodySchema = z.object({
  eventId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = bodySchema.parse(await request.json());

    const event = await markReviewEventCopied(body.eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.error("events error:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
