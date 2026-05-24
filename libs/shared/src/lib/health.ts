export type HealthStatus = 'ok' | 'error';

export type DbStatus = 'connected' | 'error';

export interface HealthResponse {
  status: HealthStatus;
  db: DbStatus;
}
