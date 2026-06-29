export type Business = {
  id: string;
  name: string;
  slug: string;
  category: string;
  services: string;
  googlePlaceId: string;
  createdAt: string;
};

export type ReviewEvent = {
  id: string;
  businessId: string;
  rating: number;
  copied: boolean;
  createdAt: string;
};

export type BusinessWithEvents = Business & {
  events: ReviewEvent[];
};
