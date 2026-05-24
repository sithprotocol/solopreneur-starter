import type { HealthResponse, HealthStatus } from '@starter/shared';

export function formatHealthStatus(status: HealthStatus): string {
  return status === 'ok' ? 'All systems operational' : 'Degraded';
}

export async function fetchHealth(apiUrl: string): Promise<HealthResponse> {
  const res = await fetch(`${apiUrl}/health`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json() as Promise<HealthResponse>;
}
