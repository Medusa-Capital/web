#!/usr/bin/env node
/**
 * One-time font conversion: TTF → WOFF2
 * Run: node scripts/convert-fonts.mjs
 */
import { readFile, writeFile, stat } from "fs/promises";
import { compress } from "wawoff2";
import { join } from "path";

const fonts = [
  "inter/inter-regular.ttf",
  "inter/inter-medium.ttf",
  "inter/inter-semibold.ttf",
  "inter/inter-bold.ttf",
  "cormorant/cormorant-bold.ttf",
];

async function main() {
  for (const font of fonts) {
    const inputPath = join("public/fonts", font);
    const outputPath = inputPath.replace(".ttf", ".woff2");

    const ttfBuffer = await readFile(inputPath);
    const woff2Buffer = await compress(ttfBuffer);
    await writeFile(outputPath, woff2Buffer);

    const origSize = (await stat(inputPath)).size;
    const newSize = woff2Buffer.length;
    console.log(
      `${font}: ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${((1 - newSize / origSize) * 100).toFixed(0)}% reduction)`
    );
  }
  console.log("\n✅ All fonts converted to WOFF2!");
}

main().catch(console.error);
