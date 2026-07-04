/*
 * Genera le icone PNG della PWA a partire dagli SVG sorgente.
 * Uso:  node scripts/gen-icons.mjs
 * Richiede "sharp" (installalo con:  npm install --no-save sharp).
 * I PNG prodotti vanno committati: il build/deploy NON dipende da sharp.
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const icons = join(pub, "icons");

const anySvg = readFileSync(join(icons, "icon.svg"));
const maskSvg = readFileSync(join(icons, "icon-maskable.svg"));

async function png(svg, size, out) {
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(out);
  console.log("  ✓", out.replace(root, "."));
}

console.log("Genero le icone PWA…");
await png(anySvg, 192, join(icons, "icon-192.png"));
await png(anySvg, 512, join(icons, "icon-512.png"));
await png(maskSvg, 512, join(icons, "icon-maskable-512.png"));
await png(maskSvg, 180, join(pub, "apple-touch-icon.png"));
console.log("Fatto. Ricordati di committare i PNG in public/.");
