// lib/utm.ts
"use client";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_KEYS: (keyof UTMParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const STORAGE_KEY = "medusa_utm_params";

// Extract UTM parameters from URL
export function extractUTMFromURL(): UTMParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

// Store UTM parameters in sessionStorage
export function storeUTMParams(params: UTMParams): void {
  if (typeof window === "undefined" || Object.keys(params).length === 0) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // sessionStorage not available
  }
}

// Retrieve stored UTM parameters
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Initialize UTM tracking - call on page load
export function initUTMTracking(): UTMParams {
  const urlParams = extractUTMFromURL();

  // Only store if we have new UTM params in the URL
  if (Object.keys(urlParams).length > 0) {
    storeUTMParams(urlParams);
    return urlParams;
  }

  // Return stored params if no new ones in URL
  return getStoredUTMParams();
}

// Get UTM params for form submissions or analytics
export function getUTMParamsForSubmission(): UTMParams {
  return getStoredUTMParams();
}

// Generate a URL with UTM parameters
export function generateUTMLink(
  baseUrl: string,
  params: UTMParams
): string {
  const url = new URL(baseUrl);

  UTM_KEYS.forEach((key) => {
    const value = params[key];
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

// Predefined campaign templates for easy link generation
export const CampaignTemplates = {
  twitter: (campaign: string, content?: string): UTMParams => ({
    utm_source: "twitter",
    utm_medium: "social",
    utm_campaign: campaign,
    utm_content: content,
  }),
  instagram: (campaign: string, content?: string): UTMParams => ({
    utm_source: "instagram",
    utm_medium: "social",
    utm_campaign: campaign,
    utm_content: content,
  }),
  email: (campaign: string, content?: string): UTMParams => ({
    utm_source: "email",
    utm_medium: "email",
    utm_campaign: campaign,
    utm_content: content,
  }),
  youtube: (campaign: string, content?: string): UTMParams => ({
    utm_source: "youtube",
    utm_medium: "video",
    utm_campaign: campaign,
    utm_content: content,
  }),
  referral: (source: string, campaign: string): UTMParams => ({
    utm_source: source,
    utm_medium: "referral",
    utm_campaign: campaign,
  }),
};
