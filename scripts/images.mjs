import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public/images");
const EXTS = ["webp", "jpg", "jpeg", "png", "avif"];
const API =
  "https://lishe.co.za/wp-json/wp/v2/posts?per_page=100&_fields=slug,title&categories_exclude=29,30,28";

const dirs = ["hero", "stories", "voices", "brand", "placeholders"];

console.log("\n== Files per folder ==");
for (const d of dirs) {
  const dir = path.join(ROOT, d);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => !f.startsWith(".")) : [];
  console.log(`${d.padEnd(14)} ${files.length} file(s)`);
  for (const f of files) {
    const base = f.replace(/\.[^.]+$/, "");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(base))
      console.log(`   ! bad name: "${f}"  -> use lowercase-with-hyphens`);
  }
}

const heroOk = EXTS.some((e) => fs.existsSync(path.join(ROOT, `hero/hero-home.${e}`)));
console.log(`\nhero-home:      ${heroOk ? "[x] found" : "[ ] missing (using remote fallback)"}`);

const res = await fetch(API);
if (!res.ok) {
  console.error(`\nCould not load slugs (HTTP ${res.status})`);
  process.exit(1);
}
const posts = await res.json();
const stripTags = (s) => s.replace(/<[^>]+>/g, "").replace(/&#?\w+;/g, "");

console.log("\n== Story images (name the file exactly like the slug) ==");
let done = 0;
for (const p of posts) {
  const has = EXTS.find((e) => fs.existsSync(path.join(ROOT, `stories/${p.slug}.${e}`)));
  if (has) done++;
  console.log(`[${has ? "x" : " "}] ${p.slug}.jpg`);
  console.log(`      ${stripTags(p.title.rendered)}`);
}
console.log(`\n${done}/${posts.length} stories have a local image.\n`);
