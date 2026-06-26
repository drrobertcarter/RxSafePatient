# What's Safe Together? — SEO content site

A set of **accurate, indexable static pages** generated directly from the app's
real interaction engine and curated catalog. Every page is rendered from the same
logic that powers the live tool — nothing is fabricated.

## What's in the bundle (`rxsafecheck-seo-site.zip`)

| Section | Pages | Source |
|---|---|---|
| `/drugs/*.html` | 836 | One per catalog medicine: uses, timing, food, alcohol, what to watch, FAQ |
| `/interactions/*.html` | 12,755 | One per **flagged** drug–drug pair (severity, why, what to do) |
| `/food/*.html` | 271 | Grapefruit / calcium / alcohol pages for the drugs they actually affect |
| `/conditions/*.html` | 105 | Class/condition hubs that link to their drugs |
| index hubs | 4 | A–Z drugs, interactions, conditions, food |
| `sitemap.xml`, `robots.txt` | — | All URLs, ready for Search Console |

Every page has: a unique `<title>` + meta description, canonical URL, breadcrumbs,
JSON-LD structured data (`Drug`, `MedicalWebPage`, `FAQPage`), internal links, and a
clear "educational, not medical advice" disclaimer.

## How to deploy (GitHub Pages)

1. Unzip `rxsafecheck-seo-site.zip`.
2. Copy the **contents** of `site/` into your repo root, alongside the app's
   `index.html` (so you get `/drugs/…`, `/interactions/…`, `/sitemap.xml`, etc.).
3. Commit. GitHub Pages serves each `.html` at its own URL.
4. In Google Search Console, submit `https://rxsafecheck.com/sitemap.xml`.

The pages link back to `/` (the interactive checker), so they funnel search
traffic into the app.

## Regenerate (when the catalog grows)

```
node seo/gen_seo.mjs      # writes seo/site/
```

Change the `SITE` constant at the top of `seo/gen_seo.mjs` if your canonical
domain isn't `https://rxsafecheck.com`.

## Honest scope — why this isn't "50,000 fabricated pages"

The strategy doc suggested thousands of comparison pages, a pill identifier, and
per-drug pregnancy/missed-dose specifics. Those were **deliberately not faked**:

- **Pill identifier** — needs a licensed imprint database; no accurate free source.
- **Comparison pages** (e.g. "Ozempic vs Mounjaro") — need comparative clinical
  data the catalog doesn't hold; thin/guessed versions would mislead.
- **Pregnancy & missed-dose** — included on each drug page as **safe, generic
  guidance that routes to a pharmacist**, not invented per-drug instructions.
- Page counts reflect the **real** catalog (836 drugs) and the interactions the
  engine genuinely flags — not padded combinations. Mass-produced thin medical
  pages get penalized by search engines and, more importantly, can harm readers.

As the curated catalog grows, the page count grows with it — accurately.
