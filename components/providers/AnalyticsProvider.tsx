// components/providers/AnalyticsProvider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initUTMTracking, getStoredUTMParams } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize UTM tracking on mount
  useEffect(() => {
    const utmParams = initUTMTracking();

    // Send UTM params to GA4 if present
    if (Object.keys(utmParams).length > 0) {
      trackEvent("campaign_detected", {
        ...utmParams,
      });
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const utmParams = getStoredUTMParams();
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    trackEvent("page_view", {
      page_path: pathname,
      page_url: url,
      ...utmParams,
    });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
