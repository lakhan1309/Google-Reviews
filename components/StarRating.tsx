"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
};

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div className="flex items-center justify-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          className={cn(
            "rounded-full p-2 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50",
            value >= star ? "text-amber-400" : "text-muted-foreground"
          )}
        >
          <Star
            className="h-10 w-10"
            fill={value >= star ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
