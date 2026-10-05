import { test, expect, BrowserContext, Page } from '@playwright/test';

async function driverOpenCard(context: BrowserContext): Promise<Page> {
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);
  
  const page = await context.newPage();
  await page.goto('https://www.saucedemo.com/inventory.html');

  await page.setContent(`
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Stub Card</title>
    </head>
    <body>
      <h1>Stub Inventory / Card</h1>
      <!-- ข้อ 1: เพิ่มชื่อและนามสกุลตัวเองเข้าไปใน stub -->
      <div class="inventory_list" data-test="stub-card">
        นาย ธีร์ธวัช หลวงคา
      </div>
    </body>
    </html>
  `);

  return page;
}

test('Integration Test: Driver calls card.html (Stub) and verifies name', async ({ browser }) => {
  const context = await browser.newContext();

  const page = await driverOpenCard(context);

  const cardLocator = page.locator('[data-test="stub-card"]');
  await expect(cardLocator).toBeVisible();

  await expect(cardLocator).toContainText('นาย ธีร์ธวัช หลวงคา');

  await context.close();
});