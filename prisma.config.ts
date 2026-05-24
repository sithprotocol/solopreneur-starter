import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const databaseUrl =
  process.env['DATABASE_URL'] ??
  'postgresql://starter:starter@localhost:5432/starter?schema=public';

export default defineConfig({
  schema: 'apps/api/prisma/schema.prisma',
  migrations: {
    path: 'apps/api/prisma/migrations',
    seed: 'ts-node --compiler-options {"module":"CommonJS"} apps/api/prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
