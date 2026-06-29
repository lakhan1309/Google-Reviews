import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/admin/BusinessForm";
import { QrCodePanel } from "@/components/admin/QrCodePanel";
import { StatsPanel } from "@/components/admin/StatsPanel";
import { deleteBusiness, updateBusiness } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessById } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BusinessDetailPage({ params }: PageProps) {
  const { id } = await params;

  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  const updateAction = updateBusiness.bind(null, id);
  const deleteAction = deleteBusiness.bind(null, id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-muted-foreground">Manage business settings and QR code</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <BusinessForm
          action={updateAction}
          submitLabel="Save Changes"
          defaultValues={{
            name: business.name,
            category: business.category,
            services: business.services,
            googlePlaceId: business.googlePlaceId,
          }}
        />
        <div className="space-y-6">
          <QrCodePanel slug={business.slug} businessName={business.name} />
          <StatsPanel events={business.events} />
        </div>
      </div>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={deleteAction}>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete this business and all associated analytics.
            </p>
            <Button type="submit" variant="destructive">
              Delete Business
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
