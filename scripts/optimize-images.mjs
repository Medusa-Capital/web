#!/usr/bin/env node
/**
 * One-time image optimization script for homepage performance.
 * Converts PNGs to WebP, compresses existing WebPs, resizes avatars.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const IMG_DIR = "public/img";

async function optimizeImage(input, output, opts) {
  const info = await sharp(input)
    .resize(opts.width || undefined, opts.height || undefined, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: opts.quality || 80 })
    .toFile(output);

  const original = await stat(input);
  console.log(
    `  ${input} → ${output} (${(original.size / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(0)}KB)`
  );
  return info;
}

async function main() {
  console.log("=== Team Photos: PNG → WebP ===");
  const teamPhotos = [
    { file: "team-alex-new", width: 800 },
    { file: "team-alejandro-garcia", width: 800 },
    { file: "team-alejandro-gilabert", width: 800 },
    { file: "team-borja", width: 800 },
    { file: "team-esteban", width: 800 },
  ];
  for (const photo of teamPhotos) {
    await optimizeImage(
      join(IMG_DIR, `${photo.file}.png`),
      join(IMG_DIR, `${photo.file}.webp`),
      { width: photo.width, quality: 80 }
    );
  }

  console.log("\n=== Bruno Avatar ===");
  await optimizeImage(
    join(IMG_DIR, "avatar/bruno.png"),
    join(IMG_DIR, "avatar/bruno.webp"),
    { width: 200, height: 200, quality: 80 }
  );

  console.log("\n=== CSS Background Images (compress in place) ===");
  const bgImages = [
    { file: "step-sec-obj.webp", width: 690, quality: 70 },
    { file: "cta-bg.webp", width: undefined, quality: 65 },
    { file: "content-sec-obj.webp", width: undefined, quality: 70 },
    { file: "content-coing.webp", width: undefined, quality: 70 },
  ];
  for (const img of bgImages) {
    const inputPath = join(IMG_DIR, img.file);
    const tmpPath = join(IMG_DIR, `_tmp_${img.file}`);
    await optimizeImage(inputPath, tmpPath, {
      width: img.width,
      quality: img.quality,
    });
    // Replace original with optimized
    const { rename } = await import("fs/promises");
    await rename(tmpPath, inputPath);
  }

  console.log("\n=== Collaborator Avatars ===");
  const collaborators = await readdir(join(IMG_DIR, "avatar/collaborators"));
  for (const file of collaborators) {
    if (file.startsWith(".")) continue;
    const ext = file.split(".").pop();
    const name = file.replace(`.${ext}`, "");
    await optimizeImage(
      join(IMG_DIR, "avatar/collaborators", file),
      join(IMG_DIR, "avatar/collaborators", `${name}.webp`),
      { width: 200, height: 200, quality: 80 }
    );
  }

  console.log("\n=== Hyperliquid ===");
  await optimizeImage(
    join(IMG_DIR, "hyperliquid.png"),
    join(IMG_DIR, "hyperliquid.webp"),
    { width: 800, quality: 80 }
  );

  console.log("\n✅ All images optimized!");
}

main().catch(console.error);
