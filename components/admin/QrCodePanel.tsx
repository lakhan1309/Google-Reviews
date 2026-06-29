import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QrCodePanelProps = {
  slug: string;
  businessName: string;
};

export function QrCodePanel({ slug, businessName }: QrCodePanelProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${slug}`;
  const qrUrl = `/api/qr/${slug}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center rounded-lg border bg-white p-4">
          <Image
            src={qrUrl}
            alt={`QR code for ${businessName}`}
            width={256}
            height={256}
            unoptimized
          />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Print at least 2×2 inches for easy scanning
        </p>
        <p className="break-all text-center text-xs text-muted-foreground">
          {reviewUrl}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            variant="outline"
            nativeButton={false}
            render={
              <a href={qrUrl} download={`${slug}-qr.png`}>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </a>
            }
          />
          <Button
            className="flex-1"
            variant="outline"
            nativeButton={false}
            render={
              <Link href={`/r/${slug}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview Page
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
