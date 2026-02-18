// lib/analytics.ts
"use client";

// GA4 Measurement ID - replace with actual ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Type definitions for gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Event categories for consistent tracking
export const EventCategory = {
  CTA: "cta",
  FORM: "form",
  VIDEO: "video",
  NAVIGATION: "navigation",
  ENGAGEMENT: "engagement",
} as const;

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Track CTA clicks
export function trackCTAClick(ctaName: string, destination?: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    destination: destination || "unknown",
    category: EventCategory.CTA,
  });
}

// Track form events
export function trackFormEvent(
  formName: string,
  action: "start" | "submit" | "error" | "success"
) {
  trackEvent("form_interaction", {
    form_name: formName,
    action,
    category: EventCategory.FORM,
  });
}

// Track video events
export function trackVideoEvent(
  videoName: string,
  action: "play" | "pause" | "complete" | "progress",
  progress?: number
) {
  trackEvent("video_interaction", {
    video_name: videoName,
    action,
    ...(progress !== undefined && { progress_percent: progress }),
    category: EventCategory.VIDEO,
  });
}

// Track modal events
export function trackModalEvent(
  modalName: string,
  action: "open" | "close" | "submit"
) {
  trackEvent("modal_interaction", {
    modal_name: modalName,
    action,
    category: EventCategory.ENGAGEMENT,
  });
}

// Track outbound links
export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent("outbound_click", {
    url,
    link_text: linkText || "unknown",
    category: EventCategory.NAVIGATION,
  });
}

// Track section views (for scroll tracking)
export function trackSectionView(sectionName: string) {
  trackEvent("section_view", {
    section_name: sectionName,
    category: EventCategory.ENGAGEMENT,
  });
}

// Track PDF lead magnet funnel events
export function trackPdfFunnelEvent(
  action: "cta_click" | "form_start" | "form_submit" | "form_success" | "form_error",
  params?: Record<string, string | number | boolean>
) {
  trackEvent(`pdf_${action}`, {
    funnel: "pdf_sistema_medusa",
    category: EventCategory.FORM,
    ...params,
  });
}
