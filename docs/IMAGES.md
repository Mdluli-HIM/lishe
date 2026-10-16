# Lishe image guide

Everything lives in `public/images/`. Files there are served from `/images/...`.

## Folders

| Folder                  | What goes in it                         | Filename rule                                |
| ----------------------- | --------------------------------------- | -------------------------------------------- |
| `hero/`                 | Homepage hero photo                     | `hero-home.jpg` (exactly)                    |
| `stories/`              | One photo per article                   | `<wordpress-slug>.jpg` (exactly the slug)    |
| `voices/`               | Expert portraits (Voices section)       | `firstname-lastname.jpg`                     |
| `brand/`                | Logo, favicon, share image              | `logo-lishe.png`, `logo-lishe-white.png`, `og-default.jpg` |
| `placeholders/`         | Fallback images                         | `placeholder-4x5.jpg`, `placeholder-16x9.jpg` |

## Naming rules

- lowercase only, words joined with hyphens, no spaces, no underscores
- no version suffixes (`final`, `v2`, `copy`). Overwrite the file instead
- extensions: `.jpg`, `.webp`, `.png`, `.avif`
- story files must match the article slug exactly. Run `npm run images` to see the slug list

## Sizes (Next.js converts to WebP/AVIF and resizes per device, so export once at full quality)

| Use                | Recommended size       | Shape                                          |
| ------------------ | ---------------------- | ---------------------------------------------- |
| Hero               | 2400 px wide           | landscape 3:2; keep the subject off the far left |
| Story photo        | 1600 px wide minimum   | any; the site crops to 4:3, 4:5, 3:4 or 1:1, so keep the subject centred |
| Voices portrait    | 1200 x 1500 px         | portrait 4:5                                   |

Keep each file under about 500 KB (JPG quality 80 is fine).

## Stable vs changing images

Stable (paste in public/images): hero/hero-home.jpg, brand/logo-lishe.png,
brand/logo-lishe-white.png, brand/og-default.jpg, departments/nutrition.jpg,
departments/fitness.jpg, departments/lifestyle.jpg, voices/firstname-lastname.jpg.

Changing (loaded from WordPress): article photos. To override a single article,
add stories/<slug>.jpg (see `npm run images:used`), but only for evergreen pieces.
