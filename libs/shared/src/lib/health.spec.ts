import type { HealthResponse } from './health';

describe('HealthResponse type', () => {
  it('accepts valid health payload', () => {
    const health: HealthResponse = { status: 'ok', db: 'connected' };
    expect(health.status).toBe('ok');
    expect(health.db).toBe('connected');
  });
});
