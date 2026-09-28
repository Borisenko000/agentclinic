import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const mavenWrapper = process.platform === "win32" ? ".\\mvnw.cmd" : "./mvnw";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Set PLAYWRIGHT_CHANNEL=chrome to use a locally installed Chrome
        // instead of the downloaded Chromium build.
        channel: process.env.PLAYWRIGHT_CHANNEL,
      },
    },
  ],
  webServer: [
    {
      command: `${mavenWrapper} -q spring-boot:run`,
      cwd: "../backend",
      url: "http://localhost:8080/api/health",
      env: {
        SPRING_DATASOURCE_URL: "jdbc:sqlite:./data/agentclinic-e2e.db",
      },
      reuseExistingServer: !isCI,
      timeout: 180_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
});
