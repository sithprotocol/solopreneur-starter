import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';
const useCompose = process.env['E2E_USE_COMPOSE'] === 'true';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: useCompose
    ? undefined
    : {
        command: 'pnpm exec nx run-many -t serve -p api,web --parallel=2',
        url: baseURL,
        reuseExistingServer: !process.env['CI'],
        cwd: workspaceRoot,
        timeout: 120_000,
      },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
