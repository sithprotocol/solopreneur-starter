'use client';

import { useCallback, useState } from 'react';
import type { HealthResponse } from '@starter/shared';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetchHealth, formatHealthStatus } from '@/lib/health';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function HealthPanel() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHealth(apiUrl);
      setHealth(data);
    } catch (e) {
      setHealth(null);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Starter Health</CardTitle>
        <CardDescription>
          API at {apiUrl} — click to verify backend and database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkHealth} disabled={loading}>
          {loading ? 'Checking…' : 'Check health'}
        </Button>
        {health && (
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">API:</span>{' '}
              {formatHealthStatus(health.status)} ({health.status})
            </p>
            <p>
              <span className="font-medium">Database:</span> {health.db}
            </p>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
