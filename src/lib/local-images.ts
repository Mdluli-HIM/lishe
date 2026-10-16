import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public");
const EXTS = ["webp", "jpg", "jpeg", "png", "avif"];

/** Returns "/images/stories/<slug>.<ext>" if you've pasted a file for that story, else null. */
export function localStoryImage(slug: string): string | null {
  for (const ext of EXTS) {
    const rel = `images/stories/${slug}.${ext}`;
    if (fs.existsSync(path.join(ROOT, rel))) return `/${rel}`;
  }
  return null;
}

/** Returns the first existing file path from a list of public-relative candidates. */
export function firstExisting(candidates: string[]): string | null {
  for (const rel of candidates) {
    if (fs.existsSync(path.join(ROOT, rel))) return `/${rel}`;
  }
  return null;
}
