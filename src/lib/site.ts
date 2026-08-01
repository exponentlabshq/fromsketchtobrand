/**
 * Shared site constants: brand metadata + primary CTA.
 * Forked from zorro-viral-landing's doneviral design system for a single
 * standalone case-study page — see agents.md for what changed and why.
 */

export const brand = {
  name: "Exponent Labs",
  tagline: "From a sketch,",
  taglineAlt: "to a finished brand.",
  email: "hello@exponentlabs.ai",
  description:
    "A real before/after AI workflow: how one founder's WhatsApp sketch became a full brand kit, packaging, an animated character, and a finished trailer for Umami Salt. Built by Exponent Labs.",
  platform: "Exponent Labs",
} as const;

/** Footer note — this page makes no investment or securities claims, unlike its parent Zorro Funding template. */
export const disclaimer =
  "Every image on this page is a real screenshot from the actual workflow — nothing staged or invented for presentation. Built by Exponent Labs for the Umami Salt brand.";

/** Primary CTA used on the landing page. */
export const primaryCta = {
  label: "Watch the Trailer",
  href: "#trailer",
} as const;
