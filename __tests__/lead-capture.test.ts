import { describe, test, expect } from "bun:test";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const AIRTABLE_WEBHOOK_URL =
  "https://hooks.airtable.com/workflows/v1/genericWebhook/appOy27N5Wx2OdFX3/wflIzSnlqhrpPnT5Q/wtrRMao3I6PL7jKvD";

describe("lead-capture webhook connectivity", () => {
  // Next.js API routes run on Node.js (not Bun). Node.js 23+ uses an aggressive
  // 250ms Happy Eyeballs timeout that fails on high-latency transatlantic
  // connections. Our instrumentation.ts fixes this by increasing the timeout.
  // This test spawns a real Node.js process to verify the fix works end-to-end.
  test("Node.js fetch reaches Airtable webhook with Happy Eyeballs fix applied", async () => {
    const script = `
      require('net').setDefaultAutoSelectFamilyAttemptTimeout(10000);
      fetch('${AIRTABLE_WEBHOOK_URL}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _test: true })
      })
        .then(r => { process.stdout.write(String(r.status)); if (!r.ok) process.exit(1); })
        .catch(e => { process.stderr.write(e.message); process.exit(1); });
    `;

    const { stdout } = await execFileAsync("node", ["-e", script], {
      timeout: 15_000,
    });
    expect(stdout.trim()).toBe("200");
  }, 20_000);

  // Verifies that without the fix, Node.js cannot reach the webhook.
  // If this test starts FAILING (i.e. Node.js connects fine without the fix),
  // it means the upstream issue is resolved and instrumentation.ts can be removed.
  test("Node.js fetch fails WITHOUT the fix (proves instrumentation.ts is still needed)", async () => {
    const script = `
      fetch('${AIRTABLE_WEBHOOK_URL}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _test: true })
      })
        .then(() => { process.stdout.write('CONNECTED'); })
        .catch(() => { process.stdout.write('FAILED'); });
    `;

    const { stdout } = await execFileAsync("node", ["-e", script], {
      timeout: 15_000,
    });

    if (stdout.trim() === "CONNECTED") {
      console.warn(
        "\n⚠️  Node.js can now reach Airtable without the Happy Eyeballs fix.\n" +
          "   The upstream issue may be resolved — consider removing instrumentation.ts.\n"
      );
    }

    expect(stdout.trim()).toBe("FAILED");
  }, 20_000);
});
