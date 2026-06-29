import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type JsonBusiness = {
  id: string;
  name: string;
  slug: string;
  category: string;
  services: string;
  googlePlaceId: string;
  createdAt: string;
};

async function main() {
  const filePath = path.join(process.cwd(), "data", "businesses.json");
  const raw = await readFile(filePath, "utf-8");
  const businesses = JSON.parse(raw) as JsonBusiness[];

  for (const business of businesses) {
    await prisma.business.upsert({
      where: { slug: business.slug },
      update: {
        name: business.name,
        category: business.category,
        services: business.services,
        googlePlaceId: business.googlePlaceId,
      },
      create: {
        name: business.name,
        slug: business.slug,
        category: business.category,
        services: business.services,
        googlePlaceId: business.googlePlaceId,
      },
    });
    console.log(`Imported: ${business.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
