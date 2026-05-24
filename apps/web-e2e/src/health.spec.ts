import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Starter' })).toBeVisible();
});

test('health check shows API ok', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Check health' }).click();
  await expect(page.getByText(/All systems operational/)).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText(/connected/)).toBeVisible();
});
