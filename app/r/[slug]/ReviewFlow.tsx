"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getGoogleReviewUrl } from "@/lib/google-review-url";

type ReviewFlowProps = {
  businessName: string;
  slug: string;
  googlePlaceId: string;
};

export function ReviewFlow({ businessName, slug, googlePlaceId }: ReviewFlowProps) {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRatingChange(newRating: number) {
    setRating(newRating);
    setReviews([]);
    setSelectedIndex(null);
    setEventId(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, rating: newRating }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate reviews");
      }

      setReviews(data.reviews);
      setEventId(data.eventId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectReview(index: number, review: string) {
    setSelectedIndex(index);

    try {
      await navigator.clipboard.writeText(review);
      toast.success("Review copied to clipboard");

      if (eventId) {
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
      }
    } catch {
      toast.error("Could not copy to clipboard. Please copy manually.");
    }
  }

  function handleGoToGoogle() {
    window.open(getGoogleReviewUrl(googlePlaceId), "_blank", "noopener,noreferrer");
  }

  return (
    <Card className="w-full max-w-lg border-0 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{businessName}</CardTitle>
        <p className="text-muted-foreground">How was your experience?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <StarRating
          value={rating}
          onChange={handleRatingChange}
          disabled={loading}
        />

        {loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating review options...
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {error && !loading && (
          <p className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && reviews.length > 0 && (
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Tap a review to copy it to your clipboard
            </p>
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                review={review}
                index={index}
                selected={selectedIndex === index}
                onSelect={() => handleSelectReview(index, review)}
              />
            ))}
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={selectedIndex === null}
          onClick={handleGoToGoogle}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Go to Google Review
        </Button>

        {selectedIndex !== null && (
          <p className="text-center text-xs text-muted-foreground">
            Paste your copied review on Google, select your rating, and submit.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
