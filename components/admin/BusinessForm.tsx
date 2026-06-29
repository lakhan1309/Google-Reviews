import { BUSINESS_CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BusinessFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  defaultValues?: {
    name: string;
    category: string;
    services: string;
    googlePlaceId: string;
  };
};

export function BusinessForm({
  action,
  submitLabel,
  defaultValues,
}: BusinessFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={defaultValues?.name}
              placeholder="Joe's Pizza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              required
              defaultValue={defaultValues?.category ?? "restaurant"}
              className={cn(
                "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              )}
            >
              {BUSINESS_CATEGORIES.map((category) => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="services">Services & Offerings</Label>
            <Textarea
              id="services"
              name="services"
              required
              rows={4}
              defaultValue={defaultValues?.services}
              placeholder="Wood-fired pizzas, pasta, craft beers, cozy dine-in atmosphere..."
            />
            <p className="text-xs text-muted-foreground">
              Used by AI to generate relevant review content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googlePlaceId">Google Place ID</Label>
            <Input
              id="googlePlaceId"
              name="googlePlaceId"
              required
              defaultValue={defaultValues?.googlePlaceId}
              placeholder="ChIJ..."
            />
            <p className="text-xs text-muted-foreground">
              Find it on{" "}
              <a
                href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google Place ID Finder
              </a>
            </p>
          </div>

          <Button type="submit">{submitLabel}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
