import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:9090",
  },
  webServer: {
    command: "bun run dev -- --port 9090",
    port: 9090,
    reuseExistingServer: true,
    timeout: 20_000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
