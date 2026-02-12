/**
 * Quick pixel check on processed logos.
 * Run: bun scripts/verify-logos.ts
 */
import sharp from "sharp";
import { join } from "path";

const dir = join(import.meta.dir, "../public/img/logos/white");

for (const file of ["blackrock.png", "bridgewater.png", "ark.png", "strategy.png", "tesla.png"]) {
  const img = sharp(join(dir, file));
  const meta = await img.metadata();
  const { data } = await sharp(join(dir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let opaqueCount = 0;
  let totalPixels = meta.width! * meta.height!;
  let samplePixels: string[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a > 0) {
      opaqueCount++;
      if (samplePixels.length < 5) {
        samplePixels.push(`rgba(${r},${g},${b},${a})`);
      }
    }
  }

  console.log(`\n${file}: ${meta.width}x${meta.height}, ${meta.channels}ch, premultiplied=${meta.premultiplied}`);
  console.log(`  Opaque pixels: ${opaqueCount}/${totalPixels} (${((opaqueCount/totalPixels)*100).toFixed(1)}%)`);
  console.log(`  Sample opaque pixels: ${samplePixels.join(", ")}`);
}
