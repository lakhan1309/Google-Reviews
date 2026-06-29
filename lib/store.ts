import { prisma } from "@/lib/prisma";
import type { Business, BusinessWithEvents, ReviewEvent } from "@/lib/types";

function toBusiness(record: {
  id: string;
  name: string;
  slug: string;
  category: string;
  services: string;
  googlePlaceId: string;
  createdAt: Date;
}): Business {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    category: record.category,
    services: record.services,
    googlePlaceId: record.googlePlaceId,
    createdAt: record.createdAt.toISOString(),
  };
}

function toReviewEvent(record: {
  id: string;
  businessId: string;
  rating: number;
  copied: boolean;
  createdAt: Date;
}): ReviewEvent {
  return {
    id: record.id,
    businessId: record.businessId,
    rating: record.rating,
    copied: record.copied,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function listBusinessesWithEvents(): Promise<BusinessWithEvents[]> {
  const businesses = await prisma.business.findMany({
    include: {
      events: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return businesses.map((business) => ({
    ...toBusiness(business),
    events: business.events.map(toReviewEvent),
  }));
}

export async function getBusinessById(
  id: string
): Promise<BusinessWithEvents | null> {
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!business) {
    return null;
  }

  return {
    ...toBusiness(business),
    events: business.events.map(toReviewEvent),
  };
}

export async function getBusinessBySlug(
  slug: string
): Promise<Business | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
  });

  return business ? toBusiness(business) : null;
}

export async function createBusiness(
  data: Omit<Business, "id" | "createdAt">
): Promise<Business> {
  const business = await prisma.business.create({ data });
  return toBusiness(business);
}

export async function updateBusiness(
  id: string,
  data: Omit<Business, "id" | "createdAt">
): Promise<Business | null> {
  try {
    const business = await prisma.business.update({
      where: { id },
      data,
    });
    return toBusiness(business);
  } catch {
    return null;
  }
}

export async function deleteBusiness(id: string): Promise<boolean> {
  try {
    await prisma.business.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function createReviewEvent(
  businessId: string,
  rating: number
): Promise<ReviewEvent> {
  const event = await prisma.reviewEvent.create({
    data: { businessId, rating },
  });
  return toReviewEvent(event);
}

export async function markReviewEventCopied(
  eventId: string
): Promise<ReviewEvent | null> {
  try {
    const event = await prisma.reviewEvent.update({
      where: { id: eventId },
      data: { copied: true },
    });
    return toReviewEvent(event);
  } catch {
    return null;
  }
}

export async function seedDefaultData() {
  const count = await prisma.business.count();
  if (count > 0) {
    return;
  }

  await prisma.business.create({
    data: {
      name: "Joe's Pizza",
      slug: "joes-pizza",
      category: "restaurant",
      services:
        "Wood-fired pizzas, fresh pasta, craft beers, family-friendly dine-in, quick takeout, and weekend brunch specials.",
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    },
  });
}
