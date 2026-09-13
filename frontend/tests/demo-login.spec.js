import { test, expect } from '@playwright/test';

test('la cuenta precargada inicia sesión y muestra sus tres recetas', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('demo@example.com');
  await page.getByLabel('Contraseña').fill('Recetas123!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Mis recetas' })).toBeVisible();
  for (const title of ['Arroz con verduras', 'Tortilla de espinaca', 'Ensalada de garbanzos']) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);
});
