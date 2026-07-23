import type { IllustrationName } from "@/components/Illustration";

const ALL: IllustrationName[] = [
  "fern-1", "fern-2", "wildflower-spray", "wildflower-bouquet",
  "petals-scattered", "leaf-sprig", "pink-flower", "babys-breath",
  "eucalyptus", "lavender", "hydrangea", "cherry-blossom",
];

// Tiny deterministic string hash -> PRNG seed (mulberry32). Every page calls
// shuffledIllustrations(path) with its own route as the seed, so:
//   - each page gets a different-looking shuffle of the 12 illustrations
//     (no two pages read as "the same sequence"),
//   - the SAME page always gets the SAME shuffle on every render, so nothing
//     flickers or reshuffles between requests/hydration,
//   - pulling ill[0], ill[1], ill[2]... down a page guarantees no repeats
//     until all 12 names are used, which no page currently needs.
// True Math.random() was deliberately avoided here: these are Server
// Components, and a different random order per request would just be visual
// noise with no benefit, not "variety" in any way a visitor could perceive.
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed;
  return function rng() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic Fisher-Yates shuffle of all 12 illustration names, seeded by
 * `seed` (pass the page's route, e.g. "/rooms/deluxe"). Use ill[0], ill[1],
 * ill[2]... for each section top-to-bottom on that page — guarantees every
 * section gets a distinct illustration with zero manual bookkeeping.
 */
export function shuffledIllustrations(seed: string): IllustrationName[] {
  const rng = mulberry32(hashSeed(seed));
  const arr = [...ALL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
