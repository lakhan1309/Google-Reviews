import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.business.findUnique({
    where: { slug: "joes-pizza" },
  });

  if (!existing) {
    await prisma.business.create({
      data: {
        name: "Joe's Pizza",
        slug: "joes-pizza",
        category: "restaurant",
        services:
          "Wood-fired pizzas, fresh pasta, craft beers, family-friendly dine-in, quick takeout, and weekend brunch specials.",
        googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      },
    });
    console.log("Seeded Joe's Pizza");
  } else {
    console.log("Joe's Pizza already exists, skipping seed");
  }

  console.log("Review page: /r/joes-pizza");
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
