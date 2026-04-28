"use client";

import { useEffect } from "react";
import {
  trackSistemaMedusaEvent,
  type SistemaMedusaAnalyticsAction,
} from "@/lib/analytics";

interface SistemaMedusaAnalyticsProps {
  action: SistemaMedusaAnalyticsAction;
  params?: Record<string, string | number | boolean>;
}

export function SistemaMedusaAnalytics({
  action,
  params,
}: SistemaMedusaAnalyticsProps) {
  useEffect(() => {
    trackSistemaMedusaEvent(action, params);
  }, [action, params]);

  return null;
}
