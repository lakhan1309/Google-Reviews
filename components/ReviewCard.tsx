"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewCardProps = {
  review: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
};

export function ReviewCard({ review, selected, onSelect, index }: ReviewCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Option {index + 1}
        </span>
        {selected && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="h-3 w-3" />
            Copied
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-foreground">{review}</p>
    </button>
  );
}
