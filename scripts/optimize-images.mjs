import sharp from "sharp";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const jobs = [
  { dir: "public/images/products", width: 1000, quality: 72 },
  { dir: "public/images/categories", width: 1000, quality: 72 },
  { dir: "public/images", width: 1920, quality: 70, only: ["hero.jpg"] },
];

for (const job of jobs) {
  const out = join("optimized", job.dir);
  mkdirSync(out, { recursive: true });

  for (const file of readdirSync(job.dir)) {
    if (!/\.jpe?g$/i.test(file)) continue;
    if (job.only && !job.only.includes(file)) continue;

    const input = join(job.dir, file);
    if (!statSync(input).isFile()) continue;

    const info = await sharp(input)
      .rotate()
      .resize({ width: job.width, withoutEnlargement: true })
      .jpeg({ quality: job.quality, mozjpeg: true })
      .toFile(join(out, file));

    console.log(`${input} -> ${Math.round(info.size / 1024)} KB`);
  }
}
