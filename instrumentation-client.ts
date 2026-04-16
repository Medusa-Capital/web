// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// DSN is intentionally hardcoded — client-side DSNs are public by design
// (sent in every browser request to Sentry). process.env.NEXT_PUBLIC_* is not
// substituted for instrumentation-client.ts at build time.
Sentry.init({
  dsn: "https://4e9b9fa6add1d5525890d40788a1edf1@o4511228714287104.ingest.de.sentry.io/4511228717826128",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  enableLogs: true,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
