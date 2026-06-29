export const BUSINESS_CATEGORIES = [
  "restaurant",
  "cafe",
  "salon",
  "spa",
  "retail",
  "gym",
  "hotel",
  "clinic",
  "automotive",
  "other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];
