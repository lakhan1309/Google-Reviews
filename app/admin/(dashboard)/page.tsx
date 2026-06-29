import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listBusinessesWithEvents } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const businesses = await listBusinessesWithEvents();

  const totalScans = businesses.reduce((sum, b) => sum + b.events.length, 0);
  const totalCopied = businesses.reduce(
    (sum, b) => sum + b.events.filter((e) => e.copied).length,
    0
  );

  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: businesses.reduce(
      (sum, b) => sum + b.events.filter((e) => e.rating === rating).length,
      0
    ),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage businesses and track review assistant usage
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/businesses/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Business
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{businesses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalScans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reviews Copied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCopied}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {ratingCounts.map(({ rating, count }) => (
              <Badge key={rating} variant="secondary" className="px-3 py-1 text-sm">
                {rating}★ — {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {businesses.length === 0 ? (
            <p className="text-muted-foreground">
              No businesses yet.{" "}
              <Link href="/admin/businesses/new" className="text-primary underline">
                Add your first business
              </Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Scans</TableHead>
                  <TableHead>Copied</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell className="capitalize">{business.category}</TableCell>
                    <TableCell>{business.events.length}</TableCell>
                    <TableCell>
                      {business.events.filter((e) => e.copied).length}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/businesses/${business.id}`} />}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
