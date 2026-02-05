import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, "prisma", "schema.prisma"),

  // Required for db push
  datasource: {
    url: process.env.DATABASE_URL!,
  },

  // Required for migrations
  migrate: {
    async url() {
      return process.env.DATABASE_URL!;
    },
  },
});
