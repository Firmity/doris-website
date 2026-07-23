# Doris Mountain Boutique Hotel — Next.js site

TypeScript + Next.js (App Router) + Tailwind CSS recreation of the Doris design.

## Setup
```
cd nextjs
npm install
npm run dev
```
Open http://localhost:3000.

## Structure
- `app/` — one route per page: `/`, `/rooms`, `/rooms/executive`, `/rooms/deluxe`, `/dining`, `/experiences`, `/events`, `/gallery`, `/about`, `/contact`
- `components/Nav.tsx` — transparent-over-hero nav that solidifies on scroll (client component)
- `components/Footer.tsx` — shared footer
- `components/Placeholder.tsx` — striped placeholder standing in for real photos/video
- `public/assets/photos`, `public/assets/videos` — drop real media here, then swap `<Placeholder>` for `<Image>` / `<video>`

## Theme
Warm terracotta palette (Tailwind theme in `tailwind.config.ts`): cream `#F7F2EA`, ink `#241F1A`,
terracotta `#C1633B`, olive `#5F6B45`, muted `#5C5248`. Display font is Lora (via `next/font/google`), body is system Helvetica/Arial.

## Notes
- Booking is a static enquiry form (no live availability search), per the brief.
- All content (rooms, tariffs, amenities, nearby distances, contact info) is taken from the hotel's real details supplied in the design phase.
