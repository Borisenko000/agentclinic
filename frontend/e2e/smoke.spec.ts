import { expect, test } from "@playwright/test";

test("home page shows welcome, header and live backend status", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Добро пожаловать в AgentClinic",
    }),
  ).toBeVisible();

  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: "AgentClinic" })).toBeVisible();
  await expect(
    header.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  await expect(page.locator("[data-status]")).toHaveText("ok");
});

for (const width of [375, 1280]) {
  test(`layout has no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
