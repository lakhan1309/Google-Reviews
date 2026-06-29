import Link from "next/link";
import { QrCode, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            QR Review Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Help your customers leave Google reviews in seconds. Scan a QR code,
            pick a rating, choose an AI-generated review, and paste it on Google.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<Link href="/admin" />}>
            <Shield className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
