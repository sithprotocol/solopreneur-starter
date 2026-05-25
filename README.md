# Starter — Fullstack monorepo

Nx monorepo template for small startup projects: **Next.js** (App Router + shadcn/ui), **NestJS**, **PostgreSQL + Prisma 7**, Docker, GitHub Actions CI, and ECS Fargate deploy examples.

## Stack

| Layer     | Tech                                               |
| --------- | -------------------------------------------------- |
| Monorepo  | Nx + pnpm                                          |
| Frontend  | Next.js 16, Tailwind 4, shadcn/ui                  |
| Backend   | NestJS 11                                          |
| Database  | PostgreSQL 16, Prisma ORM 7 (`@prisma/adapter-pg`) |
| Tests     | Jest (unit), Playwright (e2e)                      |
| Git hooks | Husky, lint-staged, commitlint                     |
| Deploy    | Docker → ECR → ECS Fargate                         |

## Prerequisites

- Node.js 22 (`nvm use`)
- pnpm 10
- Docker (for compose and image builds)
- AWS CLI (for ECS deploy)

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm prisma:seed
```

### Local development (native)

```bash
# Terminal 1 — Postgres (or use docker compose up postgres -d)
docker compose up postgres -d

pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Health: http://localhost:3001/health

### Local development (Docker)

```bash
docker compose up --build
```

## Prisma 7

Connection URLs live in [`prisma.config.ts`](prisma.config.ts) (not in `schema.prisma`). The NestJS app uses the **`@prisma/adapter-pg`** driver adapter:

```ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

Generated client path: `apps/api/src/generated/prisma` (gitignored; run `pnpm prisma:generate` after clone).

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `pnpm prisma:generate` | Regenerate Prisma Client            |
| `pnpm prisma:migrate`  | Apply migrations (`migrate deploy`) |
| `pnpm prisma:seed`     | Seed demo user                      |

## Scripts

| Script           | Description                         |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Serve web + api in parallel         |
| `pnpm lint`      | ESLint across projects              |
| `pnpm typecheck` | TypeScript check (web, api, shared) |
| `pnpm test`      | Unit tests                          |
| `pnpm build`     | Production builds                   |
| `pnpm e2e`       | Playwright e2e (web)                |

## Project layout

```
apps/
  web/          Next.js frontend
  api/          NestJS API + Prisma
  web-e2e/      Playwright tests
libs/
  shared/       Shared types (e.g. HealthResponse)
docker/         Dockerfiles
infra/          ECS task definition examples
```

## Testing

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm e2e   # starts compose stack when E2E_USE_COMPOSE=true (CI)
```

## CI/CD

- **CI** — [`.github/workflows/ci.yml`](.github/workflows/ci.yml): lint → typecheck → test → build → e2e
- **Deploy** — [`.github/workflows/deploy-ecs.yml`](.github/workflows/deploy-ecs.yml): build/push images, ECS rollout

See [`infra/README.md`](infra/README.md) for AWS setup and GitHub variables.

## AI agents (Cursor & Claude Code)

| Doc                                | Purpose                                                 |
| ---------------------------------- | ------------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)           | Instructions for agents — setup, commands, architecture |
| [`CLAUDE.md`](CLAUDE.md)           | Claude Code entry (points to `AGENTS.md`)               |
| [`.cursor/rules/`](.cursor/rules/) | Cursor scoped rules (`.mdc`)                            |

## Forking for a new startup

1. Rename `@starter/source` and update import paths (`@starter/shared`).
2. Replace the `User` model and seed data in `apps/api/prisma/`.
3. Strip or replace the demo health page in `apps/web`.
4. Configure GitHub secrets/variables and ECS task definitions.
5. Add auth, observability, and IaC as needed.

## License

MIT
