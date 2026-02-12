/**
 * Converts all company logos to white-on-transparent PNGs
 * for consistent rendering on dark card backgrounds.
 *
 * Run: bun scripts/process-logos.ts
 */
import sharp from "sharp";
import { mkdir } from "fs/promises";
import { join } from "path";

const LOGOS_DIR = join(import.meta.dir, "../public/img/logos");
const OUT_DIR = join(LOGOS_DIR, "white");

type LogoConfig = {
  input: string;
  output: string;
  mode: "transparent-bg" | "dark-on-light" | "light-on-dark";
  /** Luminance threshold for solid-bg modes (0-255) */
  threshold?: number;
};

const logos: LogoConfig[] = [
  {
    input: "blackrock.png",
    output: "blackrock.png",
    mode: "dark-on-light",
    threshold: 220, // white bg (lum~255), dark text (lum~50)
  },
  {
    input: "ark.png",
    output: "ark.png",
    mode: "dark-on-light",
    threshold: 220, // white bg (lum~255), dark icon+text (lum~50)
  },
  {
    input: "bridgewater.jpg",
    output: "bridgewater.png",
    mode: "dark-on-light",
    threshold: 200, // white bg (lum~255), dark text + red arc (lum~63)
  },
  {
    input: "strategy.png",
    output: "strategy.png",
    mode: "dark-on-light",
    threshold: 100, // orange bg (lum~173), dark text (lum~30) — low threshold to avoid orange bleed
  },
  {
    input: "tesla.png",
    output: "tesla.png",
    mode: "light-on-dark",
    threshold: 180, // red bg (lum~81), white logo (lum~255) — high to avoid red edge bleed
  },
];

/**
 * For PNGs with transparent backgrounds:
 * Keep alpha channel, set all RGB to white.
 */
async function processTransparentBg(inputPath: string, outputPath: string) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    buf[i] = 255; // R
    buf[i + 1] = 255; // G
    buf[i + 2] = 255; // B
    buf[i + 3] = data[i + 3]; // preserve original alpha
  }

  await sharp(buf, {
    raw: { width: meta.width!, height: meta.height!, channels: 4 },
  })
    .png()
    .toFile(outputPath);
}

/**
 * For logos where the logo content is DARKER than the background
 * (e.g. dark text on white/orange bg).
 * Uses luminance thresholding with smooth falloff for anti-aliasing.
 */
async function processDarkOnLight(
  inputPath: string,
  outputPath: string,
  threshold: number
) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.alloc(data.length);
  // Smooth falloff zone: pixels within this range of the threshold get partial alpha
  const falloff = 30;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha: number;
    if (lum < threshold - falloff) {
      // Clearly logo content — full opacity
      alpha = 255;
    } else if (lum > threshold) {
      // Clearly background — transparent
      alpha = 0;
    } else {
      // Transition zone — smooth falloff
      alpha = Math.round(255 * ((threshold - lum) / falloff));
    }

    buf[i] = 255;
    buf[i + 1] = 255;
    buf[i + 2] = 255;
    buf[i + 3] = alpha;
  }

  await sharp(buf, {
    raw: { width: meta.width!, height: meta.height!, channels: 4 },
  })
    .png()
    .toFile(outputPath);
}

/**
 * For logos where the logo content is LIGHTER than the background
 * (e.g. white logo on red bg — Tesla).
 */
async function processLightOnDark(
  inputPath: string,
  outputPath: string,
  threshold: number
) {
  const image = sharp(inputPath);
  const meta = await image.metadata();
  const { data } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buf = Buffer.alloc(data.length);
  const falloff = 40;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let alpha: number;
    if (lum > threshold + falloff) {
      alpha = 255;
    } else if (lum < threshold) {
      alpha = 0;
    } else {
      alpha = Math.round(255 * ((lum - threshold) / falloff));
    }

    buf[i] = 255;
    buf[i + 1] = 255;
    buf[i + 2] = 255;
    buf[i + 3] = alpha;
  }

  await sharp(buf, {
    raw: { width: meta.width!, height: meta.height!, channels: 4 },
  })
    .png()
    .toFile(outputPath);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const logo of logos) {
    const inputPath = join(LOGOS_DIR, logo.input);
    const outputPath = join(OUT_DIR, logo.output);

    console.log(`Processing ${logo.input} → white/${logo.output} (${logo.mode})`);

    switch (logo.mode) {
      case "transparent-bg":
        await processTransparentBg(inputPath, outputPath);
        break;
      case "dark-on-light":
        await processDarkOnLight(inputPath, outputPath, logo.threshold ?? 180);
        break;
      case "light-on-dark":
        await processLightOnDark(inputPath, outputPath, logo.threshold ?? 180);
        break;
    }
  }

  console.log("\nDone! White logos saved to public/img/logos/white/");
}

main().catch(console.error);
