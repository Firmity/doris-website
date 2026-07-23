// Single source of truth for "what's near Doris" — used by both the full
// /experiences page and the Home page's "Nearby" carousel. Previously the
// Home carousel hand-picked 4 of these into its own inline array, which had
// drifted out of sync with the full list (12 entries on /experiences, only 4
// on Home). Centralizing here means both places always show the same set —
// change/add a location once, it shows up everywhere it's used.
export interface ExperienceRow {
  title: string;
  desc: string;
  photo: string;
}

export const EXPERIENCES: ExperienceRow[] = [
  { title: "Dharamshala Main City", desc: "≈7 km · 15 min · The administrative and cultural heart", photo: "dharamshala-main-city" },
  { title: "McLeod Ganj", desc: "≈13 km · 30 min · Tibetan culture, cafes, the Dalai Lama Temple Complex", photo: "mcleod-ganj" },
  { title: "Dharamkot", desc: "≈11 km · 34 min · A bohemian village above McLeod Ganj, cafes and sunset views", photo: "dharamkot" },
  { title: "Triund", desc: "≈12 km plus a trek · The classic basecamp for Dhauladhar views", photo: "triund" },
  { title: "Bhagsu Nag", desc: "≈12 km · 35 min · Waterfall, a historic temple, natural pools", photo: "bhagsu-nag" },
  { title: "HPCA Stadium", desc: "≈8 km · 18 min · One of the most picturesque international cricket grounds", photo: "hpca-stadium" },
  { title: "Gyuto Monastery", desc: "≈13 km · 28 min · A magnificent temple, serene atmosphere", photo: "gyuto-monastery" },
  { title: "Norbulingka Institute", desc: "≈12 km · 27 min · Preserving Tibetan arts and crafts", photo: "norbulingka-institute" },
  { title: "Dharamshala War Memorial", desc: "≈8 km · 18 min · A peaceful memorial in the pine forests", photo: "dharamshala-war-memorial" },
  { title: "Kangra Fort", desc: "≈20 km · One of the oldest forts in India", photo: "kangra-fort" },
  { title: "Main Dharamshala Market", desc: "≈4.5 km · 10 min · The commercial hub", photo: "main-dharamshala-market" },
  { title: "Kangra Airport (DHM)", desc: "≈9 km · The nearest airport, Gaggal", photo: "kangra-airport" },
];
