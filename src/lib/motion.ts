/**
 * motion.ts — GSAP-based motion helpers for Done Viral.
 *
 * Emil Kowalski micro-animation philosophy: fast, ease-out, small, purposeful.
 * Durations ~150–700ms; easing approximates cubic-bezier(.16,1,.3,1) via
 * GSAP's `power3.out`. Reveals: opacity 0→1, translateY ~14px→0, blur 5–7px→0.
 * Children stagger ~0.07s. Counters ease-out cubic.
 *
 * HARD REQUIREMENT: every helper is a no-op / instantly-final when
 * `matchMedia('(prefers-reduced-motion: reduce)')` matches.
 *
 * These helpers are imported from per-page/per-component client <script> tags.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register the ScrollTrigger plugin once (browser only). */
function ensureRegistered(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** True when the user has requested reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Brand easing as a GSAP ease string (approximates cubic-bezier(.16,1,.3,1)). */
export const BRAND_EASE = "power3.out";

export interface RevealOptions {
  /** translateY start offset in px (default 14). */
  y?: number;
  /** blur start in px (default 5). */
  blur?: number;
  /** duration in seconds (default 0.6). */
  duration?: number;
  /** stagger between elements in seconds (default 0.07). */
  stagger?: number;
  /** ScrollTrigger start position (default "top 84%" — ~16% threshold). */
  start?: string;
}

/**
 * Force a set of elements to their final, fully-visible state immediately.
 * Used as the reduced-motion fallback so content is never left hidden.
 */
function showFinal(elements: Element[]): void {
  elements.forEach((el) => {
    el.classList.add("in");
    const node = el as HTMLElement;
    node.style.opacity = "1";
    node.style.transform = "none";
    node.style.filter = "none";
  });
}

/**
 * Mark the direct children of every `.dv-reveal-group` (rendered by
 * <Reveal stagger>) as `.reveal` targets. Because they share one parent,
 * `initScrollReveal` groups and staggers them together. Call this BEFORE
 * `initScrollReveal`. Safe to call when there are no groups.
 */
export function initRevealGroups(selector = ".dv-reveal-group"): void {
  if (typeof window === "undefined") return;
  document.querySelectorAll(selector).forEach((group) => {
    Array.from(group.children).forEach((child) => child.classList.add("reveal"));
  });
}

/**
 * Scroll-reveal initializer: blur-up + translateY, fast ease-out, fires on
 * scroll via ScrollTrigger. Elements are typically marked with `.reveal`.
 *
 * @param selector CSS selector or NodeList/array of elements to reveal.
 * @param options  Tunables (see RevealOptions).
 * @returns the created ScrollTrigger/tween instances (empty under reduced motion).
 */
export function initScrollReveal(
  selector: string | ArrayLike<Element> = ".reveal",
  options: RevealOptions = {},
): gsap.core.Tween[] {
  if (typeof window === "undefined") return [];

  const elements =
    typeof selector === "string"
      ? Array.from(document.querySelectorAll(selector))
      : Array.from(selector);

  if (elements.length === 0) return [];

  // Reduced motion: show final state immediately, no animation.
  if (prefersReducedMotion()) {
    showFinal(elements);
    return [];
  }

  ensureRegistered();

  const {
    y = 14,
    blur = 5,
    duration = 0.6,
    stagger = 0.07,
    start = "top 84%",
  } = options;

  const tweens: gsap.core.Tween[] = [];

  // Group elements by parent so siblings stagger together (matching the source).
  const groups = new Map<Element | null, Element[]>();
  elements.forEach((el) => {
    const key = el.parentElement;
    const list = groups.get(key) ?? [];
    list.push(el);
    groups.set(key, list);
  });

  groups.forEach((group) => {
    const tween = gsap.fromTo(
      group,
      { opacity: 0, y, filter: `blur(${blur}px)` },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        ease: BRAND_EASE,
        stagger,
        onComplete() {
          group.forEach((el) => el.classList.add("in"));
        },
        scrollTrigger: {
          trigger: group[0],
          start,
          once: true,
        },
      },
    );
    tweens.push(tween);
  });

  return tweens;
}

/**
 * Stagger helper: animate a set of children in with a small staggered delay.
 * Useful for grids/lists where you want a one-shot entrance (no ScrollTrigger).
 * No-op under reduced motion (children shown immediately).
 */
export function stagger(
  selector: string | ArrayLike<Element>,
  options: RevealOptions = {},
): gsap.core.Tween | null {
  if (typeof window === "undefined") return null;

  const elements =
    typeof selector === "string"
      ? Array.from(document.querySelectorAll(selector))
      : Array.from(selector);

  if (elements.length === 0) return null;

  if (prefersReducedMotion()) {
    showFinal(elements);
    return null;
  }

  ensureRegistered();

  const { y = 14, blur = 5, duration = 0.6, stagger: step = 0.07 } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y, filter: `blur(${blur}px)` },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      ease: BRAND_EASE,
      stagger: step,
    },
  );
}

export interface CounterOptions {
  /** total animation duration in seconds (default 0.9). */
  duration?: number;
  /** ScrollTrigger start (default "top 80%"). */
  start?: string;
}

/**
 * Animated-counter helper. Counts an element from 0 up to a target value
 * (read from `data-to`, or passed explicitly), preserving a `.suf` suffix
 * element inside it. Uses ease-out cubic. Fires when scrolled into view.
 *
 * Under reduced motion the final value is written immediately.
 *
 * @param el     the element whose text should count up.
 * @param target the value to count to (defaults to the element's `data-to`).
 */
export function animateCounter(
  el: HTMLElement,
  target?: number,
  options: CounterOptions = {},
): void {
  if (typeof window === "undefined") return;

  const to = target ?? parseInt(el.dataset.to ?? "0", 10);
  const sufEl = el.querySelector(".suf");
  const sufHTML = sufEl ? sufEl.outerHTML : "";

  const render = (value: number): void => {
    el.innerHTML = String(value) + sufHTML;
  };

  // Reduced motion: jump straight to the final value.
  if (prefersReducedMotion()) {
    render(to);
    return;
  }

  ensureRegistered();

  const { duration = 0.9, start = "top 80%" } = options;
  const counter = { value: 0 };

  gsap.to(counter, {
    value: to,
    duration,
    ease: "power3.out", // ease-out cubic feel
    onUpdate() {
      render(Math.round(counter.value));
    },
    onComplete() {
      render(to);
    },
    scrollTrigger: {
      trigger: el,
      start,
      once: true,
    },
  });
}

/**
 * Convenience: wire all `[data-to]` counters on the page.
 */
export function initCounters(
  selector = "[data-to]",
  options: CounterOptions = {},
): void {
  if (typeof window === "undefined") return;
  document
    .querySelectorAll<HTMLElement>(selector)
    .forEach((el) => animateCounter(el, undefined, options));
}
