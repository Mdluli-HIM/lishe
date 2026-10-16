import fs from "node:fs";
import path from "node:path";

const API = "https://lishe.co.za/wp-json/wp/v2";
const DIR = path.join(process.cwd(), "public/images/stories");
const EXTS = ["webp", "jpg", "jpeg", "png", "avif"];
const EXCLUDE = "29,30,28";

// keep in sync with src/lib/categories.ts
const DEPTS = {
  nutrition: ["nutrition", "nourishmentonaplate"],
  fitness: ["fitness", "health-coach-at-work"],
  lifestyle: ["lifestyle", "travel", "education", "financial-fitness"],
};

const get = async (p) => {
  const r = await fetch(`${API}${p}`);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${p}`);
  return r.json();
};
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#?\w+;/g, " ");

const used = new Map();
const add = (post, where) => {
  const e = used.get(post.slug) ?? { title: strip(post.title.rendered), where: [] };
  if (!e.where.includes(where)) e.where.push(where);
  used.set(post.slug, e);
};

const terms = await get("/categories?per_page=100&_fields=id,slug");
const latest = await get(`/posts?per_page=12&categories_exclude=${EXCLUDE}&_fields=slug,title`);

latest.slice(1, 6).forEach((p, i) => {
  if (i === 2) return;
  const shape = ["4:3 large", "3:4 narrow", "", "5:6 medium", "1:1 small"][i];
  add(p, `Featured grid (${shape})`);
});

for (const [key, slugs] of Object.entries(DEPTS)) {
  const ids = terms.filter((t) => slugs.includes(t.slug)).map((t) => t.id).join(",");
  const posts = await get(`/posts?per_page=3&categories=${ids}&_fields=slug,title`);
  posts.forEach((p, i) => {
    add(p, `Menu: ${key} (4:5)`);
    if (i === 0) add(p, `Category row: ${key} (3:4 / 4:3)`);
    if (i === 0 && key === "fitness") add(p, "Fitness feature (4:5 large)");
  });
}

let done = 0;
for (const [slug, e] of used) {
  const has = EXTS.some((x) => fs.existsSync(path.join(DIR, `${slug}.${x}`)));
  if (has) done++;
  console.log(`[${has ? "x" : " "}] ${slug}.jpg`);
  console.log(`      ${e.title}`);
  e.where.forEach((w) => console.log(`      - ${w}`));
}
console.log(`\n${done}/${used.size} on-screen stories have a local image.\n`);
