import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReviewEvent } from "@/lib/types";

type StatsPanelProps = {
  events: ReviewEvent[];
};

export function StatsPanel({ events }: StatsPanelProps) {
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: events.filter((e) => e.rating === rating).length,
  }));

  const copiedCount = events.filter((e) => e.copied).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Scans</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reviews Copied</p>
            <p className="text-2xl font-bold">{copiedCount}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Rating Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {ratingCounts.map(({ rating, count }) => (
              <Badge key={rating} variant="secondary">
                {rating}★ — {count}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
