import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DbErrorPanel() {
  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Database connection failed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>The admin dashboard could not reach the database. Check these on Vercel:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <code className="text-foreground">DATABASE_URL</code> is set (use Neon&apos;s{" "}
            <strong>pooled</strong> connection string)
          </li>
          <li>
            Migrations have been run:{" "}
            <code className="text-foreground">npm run db:deploy</code>
          </li>
          <li>
            Sample data seeded: <code className="text-foreground">npm run db:seed</code>
          </li>
        </ul>
        <Button nativeButton={false} render={<Link href="/admin/login" />}>
          Back to login
        </Button>
      </CardContent>
    </Card>
  );
}
