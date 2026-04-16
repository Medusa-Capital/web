import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  sendDefaultPii: false,
  // Replay is off in v1 — enable when we have enough traffic to make it
  // worthwhile (adds bundle size)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
