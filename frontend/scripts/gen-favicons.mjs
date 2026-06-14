// One-off generator: renders public/favicon.svg into the raster icon set
// (favicon.ico + logo192.png + logo512.png) so all browser / iOS / PWA
// surfaces show the NexHire mark, not the stale CRA defaults.
//
// Run from the frontend/ dir:  node scripts/gen-favicons.mjs
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const svg = await readFile(join(publicDir, "favicon.svg"));

// Render a PNG buffer at the given square size from the source SVG.
const render = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

// PWA / apple-touch icons.
await writeFile(join(publicDir, "logo192.png"), await render(192));
await writeFile(join(publicDir, "logo512.png"), await render(512));

// Multi-resolution .ico for legacy/desktop fallback.
const icoSizes = await Promise.all([16, 32, 48, 64].map(render));
await writeFile(join(publicDir, "favicon.ico"), await pngToIco(icoSizes));

console.log("Generated logo192.png, logo512.png, favicon.ico from favicon.svg");
