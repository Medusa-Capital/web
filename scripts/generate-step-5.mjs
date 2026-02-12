import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/img");

// Dark variant (white number, for dark backgrounds)
const darkSvg = `
<svg width="112" height="112" viewBox="0 0 112 112" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1b1a64"/>
      <stop offset="100%" stop-color="#3a54f8"/>
    </linearGradient>
  </defs>
  <circle cx="56" cy="56" r="53" fill="none" stroke="url(#ringGrad)" stroke-width="6"/>
  <circle cx="56" cy="56" r="44" fill="none" stroke="rgba(185,184,235,0.15)" stroke-width="1"/>
  <text x="56" y="56" text-anchor="middle" dominant-baseline="central"
    font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="300"
    fill="rgba(255,255,255,0.9)">5</text>
</svg>`;

// Light variant (dark number, for light backgrounds)
const lightSvg = `
<svg width="112" height="112" viewBox="0 0 112 112" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ringGradL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3a54f8"/>
      <stop offset="100%" stop-color="#1b1a64"/>
    </linearGradient>
  </defs>
  <circle cx="56" cy="56" r="53" fill="none" stroke="url(#ringGradL)" stroke-width="6"/>
  <circle cx="56" cy="56" r="44" fill="none" stroke="rgba(27,26,100,0.12)" stroke-width="1"/>
  <text x="56" y="56" text-anchor="middle" dominant-baseline="central"
    font-family="system-ui, -apple-system, sans-serif" font-size="40" font-weight="300"
    fill="#1b1a64">5</text>
</svg>`;

await sharp(Buffer.from(darkSvg))
  .webp({ quality: 90 })
  .toFile(join(outDir, "step-count-5.webp"));

await sharp(Buffer.from(lightSvg))
  .webp({ quality: 90 })
  .toFile(join(outDir, "step-count-5-light.webp"));

console.log("Generated step-count-5.webp and step-count-5-light.webp");
