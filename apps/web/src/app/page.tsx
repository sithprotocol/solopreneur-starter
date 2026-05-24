import { HealthPanel } from '@/components/health-panel';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Starter</h1>
        <p className="mt-2 text-muted-foreground">
          Nx monorepo · Next.js · NestJS · Prisma
        </p>
      </div>
      <HealthPanel />
    </main>
  );
}
