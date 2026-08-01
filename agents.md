# agents.md — From Sketch to Brand

For any AI agent working in this repo.

## 1. One sentence

A single-page Astro case study: a real, screenshot-by-screenshot before/after AI workflow (WhatsApp sketch → ChatGPT brand kit → packaging → Higgsfield-animated character → finished trailer) for Umami Salt, built by Exponent Labs.

## 2. What this is NOT

This repo started as a `git clone` of `exponentlabshq/zorro-viral-landing` (private) — a full password-gated survey + AI-generated PDF dossier funnel for Zorro Funding. That entire backend (`netlify/functions/*`, `netlify/edge-functions/gate.ts`, `netlify/lib/generateDossier.js`, `public/dossier/*`, `docs/*`, `scripts/*`) was **deleted** here — this page doesn't do surveys, doesn't generate PDFs, and doesn't gate content behind a password. Only the front-end design system (`src/components/*`, `src/styles/global.css`) and the Astro/Tailwind scaffolding were kept.

If you're wondering where the funnel went: it's not missing, it was intentionally removed. Don't re-add it.

## 3. Read first

1. This file
2. `README.md`
3. `src/pages/index.astro` — the entire page (hero, 13 phases, stat band, final CTA)
4. `src/lib/motion.ts` — GSAP scroll-reveal (see gotcha below)

## 4. Do not regress

- **The reveal-init script matters.** `src/pages/index.astro` has a small `<script>` right before the `<style>` block that calls `initRevealGroups()`, `initScrollReveal()`, `initCounters()` from `src/lib/motion.ts`. Every visible element with `class="reveal"` (or wrapped in `<Reveal>`) starts at `opacity:0` in CSS and is *only* made visible by that script running. **Delete that script and the entire page goes blank** — this exact regression happened once during a cleanup pass and looked like "all the content is missing." If you're removing "unused" code, grep for `initScrollReveal` first and make sure whatever you're deleting doesn't contain it.
- Every phase image is a real screenshot from the actual workflow, in `public/assets/`. Don't replace them with mockups or placeholder art.
- The video in Phase 13 must be a browser-playable `.mp4` (H.264/AAC). A `.mov` file with `type="video/quicktime"` will not play in Chrome — Chrome returns `canPlayType('video/quicktime') === ""` regardless of the actual codec inside. If a new trailer file shows up as `.mov`, remux it: `ffmpeg -i input.mov -c copy -movflags +faststart output.mp4` (copy, not re-encode — it's near-instant if the codec is already H.264/AAC).

## 5. Design system

Neo-brutalist "Done Viral" tokens, defined in `src/styles/global.css` (`@theme static` block): paper `#F5F3EC`, ink `#0E0E0E`, indigo `#3B2EFF`, yellow `#FFE600`, hard offset shadows (no blur), Archivo + Space Mono. Components: `Section`, `SecHeader`, `Card`, `Button`, `Tag`, `Sticker`, `Reveal`, `Marquee`, `Nav`, `Footer` in `src/components/`. Reuse these; don't invent new visual patterns.

## 6. Deploy

Static site, no functions, no env vars required.

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 7. Event this was built for

AI Clinic for OC Business Owners & Operators — Ticket 500, Newport Beach, CA. Hosted by Stephan Fitzpatrick, featuring John Xu (Spatial Labs) and Adam Stinson (Dark Horse Growth). Presented live on stage by Rocky Nguyen as one of the night's three before/after AI workflow case studies.
