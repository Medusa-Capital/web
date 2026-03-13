"use client";

import { useEffect, useState } from "react";
import { getOutboundUrl } from "@/lib/utm";
import { trackCallBooked } from "@/lib/analytics";

interface CalendlyEmbedProps {
  url: string;
  className?: string;
}

export function CalendlyEmbed({ url, className }: CalendlyEmbedProps) {
  const [height, setHeight] = useState(1400);
  const enrichedUrl = getOutboundUrl(url);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.page_height" && e.data?.payload?.height) {
        const px = parseInt(e.data.payload.height, 10);
        if (!isNaN(px) && px > 0) setHeight(px);
      }
      if (e.data?.event === "calendly.event_scheduled") {
        trackCallBooked();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      src={enrichedUrl}
      width="100%"
      height={height}
      frameBorder="0"
      className={className}
      title="Agendar sesión estratégica"
    />
  );
}
