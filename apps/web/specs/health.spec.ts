import { formatHealthStatus } from '../src/lib/health';

describe('formatHealthStatus', () => {
  it('formats ok status', () => {
    expect(formatHealthStatus('ok')).toBe('All systems operational');
  });

  it('formats error status', () => {
    expect(formatHealthStatus('error')).toBe('Degraded');
  });
});
