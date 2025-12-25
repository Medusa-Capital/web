# Analytics Setup Documentation

## Overview

This document describes the analytics implementation for Medusa Capital landing page.

## Google Analytics 4 Setup

### Configuration

1. Create a GA4 property at https://analytics.google.com/
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Events Tracked

| Event Name | Category | Description |
|------------|----------|-------------|
| `page_view` | - | Automatic on route change |
| `cta_click` | cta | CTA button clicks |
| `form_interaction` | form | Form start/submit/success/error |
| `video_interaction` | video | Video play/pause/complete |
| `modal_interaction` | engagement | Modal open/close/submit |
| `outbound_click` | navigation | External link clicks |
| `faq_expand` | engagement | FAQ accordion expansion |
| `module_view` | engagement | Module tab selection |
| `navigation_click` | navigation | Internal navigation |
| `theme_toggle` | engagement | Dark/light mode toggle |
| `campaign_detected` | - | UTM params detected |

## UTM Parameter Tracking

### Supported Parameters

- `utm_source` - Traffic source (twitter, email, etc.)
- `utm_medium` - Marketing medium (social, email, etc.)
- `utm_campaign` - Campaign name
- `utm_term` - Paid search terms (optional)
- `utm_content` - Content identifier (optional)

### Link Generation

Use the script to generate UTM links:
```bash
npx ts-node scripts/generate-utm-links.ts
```

### Example Links

```
# Twitter bio link
https://medusacapital.com?utm_source=twitter&utm_medium=social&utm_campaign=launch_2025&utm_content=bio_link

# Email newsletter
https://medusacapital.com?utm_source=email&utm_medium=email&utm_campaign=newsletter_weekly&utm_content=header_cta
```

## Data Flow

1. User arrives with UTM parameters → stored in sessionStorage
2. UTM params sent to GA4 with `campaign_detected` event
3. UTM params included with lead capture form submission
4. All UTM params forwarded to Airtable webhook

## Testing

1. Add `?utm_source=test&utm_medium=test&utm_campaign=test` to URL
2. Open browser DevTools → Network tab
3. Verify GA4 requests include custom events
4. Submit lead form and verify UTM params in Airtable

## GA4 Dashboard Setup

Recommended custom reports:

1. **Acquisition by Campaign** - Group by utm_campaign
2. **CTA Performance** - Filter by event_name = cta_click
3. **Lead Form Funnel** - Sequence: modal_open → form_submit → form_success
4. **Content Engagement** - FAQ, Module, Video interactions
