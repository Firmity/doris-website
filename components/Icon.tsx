// Minimal hand-drawn line icons for amenity/facility lists. Deliberately not pulling
// in an icon package (lucide-react etc.) — this project has zero icon dependency today,
// and 20 icons don't justify a new dependency + install risk. Same stroke weight/style
// as the rest of the site's understated line-art aesthetic; no rounded corners, no fills.
export type IconName =
  | "climate" | "tv" | "beverage" | "toiletries" | "water" | "phone" | "desk"
  | "roomservice" | "medical" | "parking" | "security" | "business" | "restaurant"
  | "banquet" | "catering" | "wifi" | "laundry" | "smoking" | "power" | "elevator"
  | "accessible" | "default";

const paths: Record<IconName, React.ReactNode> = {
  climate: (
    <>
      <path d="M12 2v20M4.5 5.5l15 13M19.5 5.5l-15 13" />
      <path d="M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2" />
    </>
  ),
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  beverage: (
    <>
      <path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M16 9h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3c0 1-1 1-1 2M11 3c0 1-1 1-1 2" />
    </>
  ),
  toiletries: (
    <>
      <path d="M9 3h6v3H9z" />
      <path d="M8 6h8l1 14H7L8 6Z" />
    </>
  ),
  water: <path d="M12 2s6 7 6 11.5A6 6 0 0 1 6 13.5C6 9 12 2 12 2Z" />,
  phone: <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  desk: (
    <>
      <path d="M3 10h18M5 10v9M19 10v9" />
      <path d="M3 6h18v4H3z" />
    </>
  ),
  roomservice: (
    <>
      <path d="M3 18h18" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <path d="M12 8v3" />
      <circle cx="12" cy="6" r="2" />
    </>
  ),
  medical: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" />
    </>
  ),
  security: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />,
  business: (
    <>
      <rect x="3" y="8" width="18" height="12" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  restaurant: (
    <>
      <path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11" />
      <path d="M16 3s-2 2-2 5 2 3 2 3v9" />
    </>
  ),
  banquet: (
    <>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  catering: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0Z" />
      <path d="M2 13h20M11 6V3h2v3" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 9a15 15 0 0 1 18 0" />
      <path d="M6.5 12.5a10 10 0 0 1 11 0" />
      <path d="M10 16a5 5 0 0 1 4 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  laundry: (
    <>
      <rect x="4" y="3" width="16" height="18" />
      <circle cx="12" cy="13" r="5" />
      <path d="M7 6h.01M10 6h.01" />
    </>
  ),
  smoking: (
    <>
      <path d="M2 16h14v3H2z" />
      <path d="M20 12s2-1 2-3M20 8s2-1 2-3" />
    </>
  ),
  power: <path d="M9 2v8M15 2v8M6 10h12l-1 5a5 5 0 0 1-5 4v3h-2v-3a5 5 0 0 1-5-4l-1-5Z" />,
  elevator: (
    <>
      <rect x="5" y="3" width="14" height="18" />
      <path d="M10 9l2-2 2 2M10 15l2 2 2-2" />
    </>
  ),
  accessible: (
    <>
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 7v5l4 2M12 12l-3 8M12 12l3 8M9 20h6" />
    </>
  ),
  default: <circle cx="12" cy="12" r="2" />,
};

export function matchIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (l.includes("ac") || l.includes("fan")) return "climate";
  if (l.includes("tv")) return "tv";
  if (l.includes("tea") || l.includes("coffee")) return "beverage";
  if (l.includes("dental") || l.includes("shaving") || l.includes("shower cap") || l.includes("comb") || l.includes("toiletr")) return "toiletries";
  if (l.includes("water")) return "water";
  if (l.includes("intercom") || l.includes("wake-up") || l.includes("wake up")) return "phone";
  if (l.includes("study")) return "desk";
  if (l.includes("room service")) return "roomservice";
  if (l.includes("doctor")) return "medical";
  if (l.includes("parking")) return "parking";
  if (l.includes("security")) return "security";
  if (l.includes("business centre") || l.includes("business center")) return "business";
  if (l.includes("restaurant") || l.includes("dining")) return "restaurant";
  if (l.includes("banquet") || l.includes("conference") || l.includes("terrace")) return "banquet";
  if (l.includes("catering")) return "catering";
  if (l.includes("wifi")) return "wifi";
  if (l.includes("laundry")) return "laundry";
  if (l.includes("smoking")) return "smoking";
  if (l.includes("power")) return "power";
  if (l.includes("elevator") || l.includes("lift")) return "elevator";
  if (l.includes("wheelchair")) return "accessible";
  return "default";
}

export default function Icon({ name, className = "w-5 h-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
