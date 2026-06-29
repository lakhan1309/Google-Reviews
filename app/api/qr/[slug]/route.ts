import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getBusinessBySlug } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const business = await getBusinessBySlug(slug);

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const reviewUrl = `${appUrl}/r/${business.slug}`;

  const png = await QRCode.toBuffer(reviewUrl, {
    type: "png",
    width: 512,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${business.slug}-qr.png"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
