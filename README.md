# From Sketch to Brand

**A real before/after AI workflow, told as a single scrollable case study: one founder's WhatsApp sketch → a full brand kit → packaging → an animated character → a finished trailer.**

Built by [Exponent Labs](https://exponentlabs.ai) for **Umami Salt** (founder: Abinashi Khalsa), and presented live on stage by Rocky Nguyen at:

> **AI Clinic for OC Business Owners & Operators**
> Hosted by Stephan Fitzpatrick, presented by Ticket 500
> Featuring John Xu (Spatial Labs) and Adam Stinson (Dark Horse Growth)
> The Ticket 500, 2807 Villa Way, Newport Beach, CA
> Format: real before/after AI workflow case studies for service businesses, followed by a live "Hot Seat" problem-solving segment

**Live:** https://fromsketchtobrand.netlify.app

## What this is

Every image in this project is a real screenshot from the actual workflow — no staged mockups, no invented copy. Thirteen phases, in order:

1. The founder's original sketch, sent over WhatsApp
2. The ChatGPT prompt
3. The brand kit result
4. Sharing it back to the group
5. The founder's packaging reference
6. The new packaging, prompted from that reference
7. Real-time group feedback
8. The full character sheet (with karate animations)
9. The finished character sheet
10. The character loaded into Higgsfield
11. ChatGPT's trailer motion prompt
12. Higgsfield's motion result
13. The finished trailer

## Design system

Forked from `exponentlabshq/zorro-viral-landing` (private) — a neo-brutalist editorial design system (Astro + Tailwind v4): cream paper background, hard offset black shadows, electric indigo + signal yellow accents, Archivo display type. Content swapped in, design system unchanged. The original repo's password-gated survey/AI-dossier-generation engine (Netlify Functions, Edge Functions, Google Apps Script) was removed — this page doesn't need it. Full detail in `agents.md`.

## Email capture

The final CTA ("I wanna learn how to do this.") posts an email to a Google Apps Script Web App, which appends it to a Google Sheet. No survey, no other fields.

- Script source: `google-apps-script/Code.gs`
- Deploy: open the target Sheet → Extensions → Apps Script → paste in `Code.gs` → Deploy → New deployment → Web app → Execute as *Me* → Who has access *Anyone* → Deploy → copy the `/exec` URL
- Wire it up: set `GAS_ENDPOINT` in `src/pages/index.astro` (bottom `<script>` block) to that URL, then rebuild and redeploy

## Running locally

```bash
npm install
npm run dev
```

## Stack

Astro 6, Tailwind v4, GSAP scroll-reveal. Static build, deployed to Netlify.
