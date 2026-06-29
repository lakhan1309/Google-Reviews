import { BusinessForm } from "@/components/admin/BusinessForm";
import { createBusiness } from "@/app/admin/actions";

export default function NewBusinessPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Business</h1>
        <p className="text-muted-foreground">
          Create a business profile and generate a QR code for your counter
        </p>
      </div>
      <BusinessForm action={createBusiness} submitLabel="Create Business" />
    </div>
  );
}
