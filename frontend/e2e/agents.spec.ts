import { expect, test } from "@playwright/test";

test("agents list opens a seed agent's profile", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Основная навигация" });
  await nav.getByRole("link", { name: "Агенты" }).click();

  await expect(page).toHaveURL("/agents");
  await expect(nav.getByRole("link", { name: "Агенты" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Агенты" }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Overfit/ }).click();

  await expect(page).toHaveURL(/\/agents\/\d+$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Overfit" }),
  ).toBeVisible();
  await expect(page.getByText("Llama 4")).toBeVisible();
  await expect(page.getByText("Meta", { exact: true })).toBeVisible();
  await expect(page.getByText("1 сентября 2026 г.")).toBeVisible();

  await page.getByRole("link", { name: "← Все агенты" }).click();
  await expect(page).toHaveURL("/agents");
});

test("empty registration form shows validation errors and creates nothing", async ({
  page,
  request,
}) => {
  const before = (await (await request.get("/api/agents")).json()).length;

  await page.goto("/agents/new");
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();

  await expect(page.getByLabel("Имя")).toHaveAccessibleDescription(
    "Укажите имя",
  );
  await expect(page.getByLabel("Модель")).toHaveAccessibleDescription(
    "Укажите модель",
  );
  await expect(page).toHaveURL("/agents/new");

  const after = (await (await request.get("/api/agents")).json()).length;
  expect(after).toBe(before);
});

test("registered agent opens its profile and appears in the list", async ({
  page,
}) => {
  // The E2E database persists between local runs, so the name must be unique.
  const name = `E2E-пациент ${Date.now()}`;

  await page.goto("/agents/new");
  await page.getByLabel("Имя").fill(name);
  await page.getByLabel("Модель").fill("GPT-5");
  await page.getByLabel(/Вендор/).fill("OpenAI");
  await page.getByLabel(/О себе/).fill("Жалуется на бесконечные промпты.");
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();

  await expect(page).toHaveURL(/\/agents\/\d+$/);
  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
  await expect(
    page.getByText("Жалуется на бесконечные промпты."),
  ).toBeVisible();

  await page.goto("/agents");
  await expect(
    page.getByRole("link", { name: new RegExp(name) }),
  ).toBeVisible();
});
