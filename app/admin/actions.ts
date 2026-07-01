"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { BUSINESS_CATEGORIES } from "@/lib/categories";
import {
  createBusiness as createBusinessRecord,
  deleteBusiness as deleteBusinessRecord,
  getBusinessBySlug,
  updateBusiness as updateBusinessRecord,
} from "@/lib/store";
import { slugify } from "@/lib/slug";
import {
  GOOGLE_REVIEW_INPUT_ERROR,
  isValidGoogleReviewInput,
} from "@/lib/google-review-url";

const businessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum([...BUSINESS_CATEGORIES]),
  services: z.string().min(1, "Services description is required"),
  googlePlaceId: z
    .string()
    .min(1, "Google Place ID or review link is required")
    .refine(isValidGoogleReviewInput, GOOGLE_REVIEW_INPUT_ERROR),
});

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await getBusinessBySlug(slug);
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function createBusiness(formData: FormData) {
  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    services: formData.get("services"),
    googlePlaceId: formData.get("googlePlaceId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const baseSlug = slugify(parsed.data.name);
  const slug = await ensureUniqueSlug(baseSlug);

  const business = await createBusinessRecord({
    ...parsed.data,
    slug,
  });

  revalidatePath("/admin");
  redirect(`/admin/businesses/${business.id}`);
}

export async function updateBusiness(id: string, formData: FormData) {
  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    services: formData.get("services"),
    googlePlaceId: formData.get("googlePlaceId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const baseSlug = slugify(parsed.data.name);
  const slug = await ensureUniqueSlug(baseSlug, id);

  await updateBusinessRecord(id, {
    ...parsed.data,
    slug,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/businesses/${id}`);
  redirect(`/admin/businesses/${id}`);
}

export async function deleteBusiness(id: string) {
  await deleteBusinessRecord(id);
  revalidatePath("/admin");
  redirect("/admin");
}
