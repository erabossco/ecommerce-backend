// Prisma config file at root dir
import { envConfig } from "./src/config/env/index.js";

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: envConfig.database.url,
  },
});
