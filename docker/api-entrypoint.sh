#!/bin/sh
set -e
if [ -n "$DATABASE_URL" ]; then
  cd /app && npx prisma migrate deploy
fi
exec "$@"
