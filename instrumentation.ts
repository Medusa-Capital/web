export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node.js 23's Happy Eyeballs algorithm uses a 250ms per-address connect
    // timeout, which is too aggressive for high-latency transatlantic connections
    // (e.g. Spain → AWS us-east-1). Increase to 10s to match typical OS defaults.
    const net = await import("net");
    net.setDefaultAutoSelectFamilyAttemptTimeout(10_000);

    // Sentry — Node.js / server-side error tracking
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: { path: string; method: string; headers: Headers },
  context: { routerKind: string; routePath: string; routeType: string }
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  await captureRequestError(err, request, context);
};
