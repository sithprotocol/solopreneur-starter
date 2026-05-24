# AWS infrastructure (manual setup)

This starter ships example ECS task definitions and a GitHub Actions deploy workflow. Provision AWS resources once per project, then wire GitHub repository variables and secrets.

## One-time checklist

1. **ECR** — Create two repositories (e.g. `starter-api`, `starter-web`).
2. **RDS PostgreSQL 16** — Private subnets; security group allows inbound `5432` from ECS tasks only.
3. **Secrets Manager** — Store `DATABASE_URL` (and reference from ECS task secrets).
4. **ECS cluster** — Fargate with two services (api, web) behind an ALB.
5. **Task definitions** — Start from [`ecs/task-definition.api.json`](ecs/task-definition.api.json) and [`ecs/task-definition.web.json`](ecs/task-definition.web.json); replace account/region placeholders.
6. **GitHub OIDC** — IAM role trusted by your repo; attach ECR push + ECS deploy policies.

## GitHub configuration

### Secrets

| Name           | Description           |
| -------------- | --------------------- |
| `AWS_ROLE_ARN` | IAM role ARN for OIDC |

### Variables

| Name                      | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `AWS_REGION`              | e.g. `us-east-1`                                  |
| `ECR_REPOSITORY_API`      | ECR repo name for API                             |
| `ECR_REPOSITORY_WEB`      | ECR repo name for web                             |
| `ECS_CLUSTER`             | ECS cluster name                                  |
| `ECS_SERVICE_API`         | API ECS service name                              |
| `ECS_SERVICE_WEB`         | Web ECS service name                              |
| `ECS_TASK_DEFINITION_API` | Task definition family for migrate run-task       |
| `ECS_SUBNETS`             | Comma-separated subnet IDs for run-task           |
| `ECS_SECURITY_GROUPS`     | Security group for migrate run-task               |
| `NEXT_PUBLIC_API_URL`     | Public API URL baked into web image at build time |

## Prisma migrations on deploy

Prisma 7 reads connection settings from [`prisma.config.ts`](../prisma.config.ts). The API Docker image runs `prisma migrate deploy` on startup via [`docker/api-entrypoint.sh`](../docker/api-entrypoint.sh).

For production, you can instead run a one-off ECS task before service rollout:

```bash
aws ecs run-task \
  --cluster "$ECS_CLUSTER" \
  --task-definition "$ECS_TASK_DEFINITION_API" \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$ECS_SUBNETS],securityGroups=[$ECS_SECURITY_GROUPS],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides":[{"name":"api","command":["npx","prisma","migrate","deploy"]}]}'
```

## Security notes

- Place ECS tasks in private subnets; expose only the ALB to the internet.
- Do not commit `.env` files; use Secrets Manager for `DATABASE_URL`.
- Scope the GitHub OIDC role to the minimum ECR/ECS permissions required.
