# Agent instructions

Guide for **Cursor** and **Claude Code** working in this repository. Open the **repo root** as the workspace (where `nx.json` lives).

## Project summary

Nx monorepo (`pnpm`) with:

| App / lib | Path           | Role                                         |
| --------- | -------------- | -------------------------------------------- |
| `web`     | `apps/web`     | Next.js 16 App Router, shadcn/ui, Tailwind 4 |
| `api`     | `apps/api`     | NestJS 11, Prisma 7, PostgreSQL              |
| `shared`  | `libs/shared`  | Shared TypeScript types (`@starter/shared`)  |
| `web-e2e` | `apps/web-e2e` | Playwright e2e against `web`                 |

Deploy path: Docker → ECR → ECS Fargate. CI: GitHub Actions.

## Workspace setup

1. Node **22** (`.nvmrc` / `.node-version`).
2. `pnpm install`
3. `cp .env.example .env`
4. `pnpm exec prisma generate`

## Before you change code

1. Use scoped rules in [`.cursor/rules/`](.cursor/rules/) when editing matching paths (Cursor).
2. Run `pnpm exec prisma generate` after schema changes (client is gitignored under `apps/api/src/generated/prisma`).
3. Prefer **minimal diffs** — match existing patterns; do not refactor unrelated code.
4. Do **not** commit unless the user asks. Do **not** push without explicit request.

## Commands

```bash
pnpm install
pnpm dev                    # web :3000 + api :3001
pnpm lint
pnpm typecheck
pnpm test
NODE_ENV=production pnpm build
pnpm e2e
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

After `origin/main` exists on the remote:

```bash
pnpm exec nx affected -t lint,typecheck,test --base=origin/main
```

## Cursor

| Source                                  | Purpose                                |
| --------------------------------------- | -------------------------------------- |
| This file (`AGENTS.md`)                 | Primary context                        |
| [`.cursor/rules/*.mdc`](.cursor/rules/) | Scoped conventions (globs / always-on) |

| Rule                   | Scope                              |
| ---------------------- | ---------------------------------- |
| `project-overview.mdc` | Always on                          |
| `api-nestjs.mdc`       | `apps/api/**`                      |
| `web-nextjs.mdc`       | `apps/web/**`                      |
| `prisma.mdc`           | Prisma schema & `prisma.config.ts` |

- Use **pnpm** only (not npm/yarn). Production web build: `NODE_ENV=production pnpm build`.
- **Husky:** pre-commit (lint-staged), commit-msg (commitlint), pre-push (nx affected or full suite if `origin/main` is missing). Use `git push --no-verify` only when intentional.

## Claude Code

Claude reads **[`CLAUDE.md`](CLAUDE.md)** at the repo root (pointer to this file). Follow the same conventions, commands, and architecture rules below.

## Architecture rules

### Monorepo

- Import shared types from `@starter/shared` (path alias in `tsconfig.base.json`).
- Add new apps with Nx generators: `pnpm nx g @nx/next:app`, `pnpm nx g @nx/nest:app`.
- Respect Nx module boundaries (`@nx/enforce-module-boundaries` in ESLint).

### API (`apps/api`)

- **Port:** `3001` (see `PORT` in env).
- **Routes:** `GET /health`, `GET /users` — no global `/api` prefix.
- **Config:** Zod-validated env in `apps/api/src/config/env.schema.ts` via `@nestjs/config`.
- **Prisma 7:** Connection URL in root [`prisma.config.ts`](prisma.config.ts), not in `schema.prisma`. Runtime client uses `@prisma/adapter-pg`:

  ```ts
  import { PrismaClient } from '../generated/prisma/client';
  import { PrismaPg } from '@prisma/adapter-pg';
  ```

- New migrations: edit `apps/api/prisma/schema.prisma`, add SQL under `apps/api/prisma/migrations/`, run `pnpm prisma:migrate` locally.
- Unit tests mock Prisma via `apps/api/src/test-utils/prisma-client.mock.ts` (Jest `moduleNameMapper`).

### Web (`apps/web`)

- **Env:** `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- **Aliases:** `@/` → `apps/web/src/*`.
- **UI:** shadcn components in `apps/web/src/components/ui/`; use `cn()` from `@/lib/utils`.
- **Production build:** requires `NODE_ENV=production` (CI sets this).
- Unit tests live in `apps/web/specs/` (Jest + jsdom).

### Docker

- Dockerfiles: `docker/api.Dockerfile`, `docker/web.Dockerfile`.
- API entrypoint runs `prisma migrate deploy` when `DATABASE_URL` is set.
- Do not commit `.env` files.

## Testing expectations

| Change type       | Run                                    |
| ----------------- | -------------------------------------- |
| API logic         | `pnpm nx run api:test`                 |
| Web UI/utils      | `pnpm nx run web:test`                 |
| Shared types      | `pnpm nx run shared:test`              |
| Cross-cutting     | `pnpm test` + `pnpm typecheck`         |
| User-facing flows | `pnpm e2e` (needs stack up or compose) |

## Troubleshooting

| Issue                             | Fix                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| Agent edits wrong app             | Workspace must be repo root; specify `apps/api` vs `apps/web`                              |
| Prisma types missing              | `pnpm prisma:generate`                                                                     |
| ESLint on generated client        | Expected — `apps/api/src/generated` is ignored                                             |
| pre-push fails (no `origin/main`) | First push: `git push --no-verify` once, or rely on pre-push fallback in `.husky/pre-push` |
| Undo only commit                  | `git update-ref -d HEAD` (not `git reset HEAD~1`)                                          |

## Forking this starter

1. Rename package `@starter/source` and `@starter/shared` imports.
2. Replace `User` model and seed in `apps/api/prisma/`.
3. Replace demo health UI in `apps/web`.
4. Configure GitHub/AWS per `infra/README.md`.
