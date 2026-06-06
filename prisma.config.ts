// Prisma config file at root dir
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { envConfig } from "./src/config/env/index.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: envConfig.database.url,
  },
});
