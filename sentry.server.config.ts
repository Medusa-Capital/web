import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Capture 100% of transactions in dev; 10% in production (adjust after launch)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  // Don't send PII — strip user IPs by default
  sendDefaultPii: false,
});
