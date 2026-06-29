import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Business not found</h1>
      <p className="text-muted-foreground">
        This QR code may be invalid or the business has been removed.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Go home
      </Button>
    </main>
  );
}
