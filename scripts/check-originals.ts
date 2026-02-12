import sharp from "sharp";
import { join } from "path";

const dir = join(import.meta.dir, "../public/img/logos");

for (const file of ["blackrock.png", "ark.png"]) {
  const meta = await sharp(join(dir, file)).metadata();
  const { data } = await sharp(join(dir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let transparentCount = 0;
  let totalPixels = meta.width! * meta.height!;
  let minAlpha = 255, maxAlpha = 0;

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 255) transparentCount++;
    if (a < minAlpha) minAlpha = a;
    if (a > maxAlpha) maxAlpha = a;
  }

  console.log(`${file}: ${meta.width}x${meta.height}, channels=${meta.channels}, hasAlpha=${meta.hasAlpha}`);
  console.log(`  Transparent pixels: ${transparentCount}/${totalPixels}`);
  console.log(`  Alpha range: ${minAlpha}-${maxAlpha}`);
}
