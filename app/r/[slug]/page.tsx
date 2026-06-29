import { notFound } from "next/navigation";
import { ReviewFlow } from "@/app/r/[slug]/ReviewFlow";
import { getBusinessBySlug } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white px-4 py-8 dark:from-neutral-950 dark:to-neutral-900">
      <ReviewFlow
        businessName={business.name}
        slug={business.slug}
        googlePlaceId={business.googlePlaceId}
      />
    </main>
  );
}
