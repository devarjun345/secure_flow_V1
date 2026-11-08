import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'demo@secureflow.io');
    await page.fill('input[type="password"]', 'demo1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Create one');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL('/forgot-password');
    await expect(page.locator('h1')).toContainText('Forgot Password?');
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Create Account');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="organizationName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.fill('input[name="password"]', 'weak');
    await expect(page.locator('text=At least 8 characters')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Organization name must be at least 2 characters')).toBeVisible();
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@secureflow.io');
    await page.fill('input[type="password"]', 'demo1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard with KPIs', async ({ page }) => {
    await expect(page.locator('text=Security Operations Center')).toBeVisible();
    await expect(page.locator('text=Monitored Repositories')).toBeVisible();
    await expect(page.locator('text=Total Scans')).toBeVisible();
    await expect(page.locator('text=Critical CVEs')).toBeVisible();
    await expect(page.locator('text=Leaked Secrets')).toBeVisible();
  });

  test('should display active scans section', async ({ page }) => {
    await expect(page.locator('text=Active Scans')).toBeVisible();
  });

  test('should display live audit stream', async ({ page }) => {
    await expect(page.locator('text=Live Audit Stream')).toBeVisible();
  });

  test('should navigate to repositories page', async ({ page }) => {
    await page.click('text=Repositories');
    await expect(page).toHaveURL('/repositories');
    await expect(page.locator('text=Repository Management')).toBeVisible();
  });

  test('should navigate to scans page', async ({ page }) => {
    await page.click('text=Scan History');
    await expect(page).toHaveURL('/scans');
    await expect(page.locator('text=Scan History')).toBeVisible();
  });

  test('should navigate to findings page', async ({ page }) => {
    await page.click('text=Vulnerabilities');
    await expect(page).toHaveURL('/findings');
    await expect(page.locator('text=Vulnerability Management')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
  });

  test('should hide sidebar on mobile by default', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page.locator('aside')).toHaveCSS('transform', /translateX\(-100%\)/);
  });
});