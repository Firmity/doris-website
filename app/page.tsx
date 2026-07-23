import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Carousel from "@/components/Carousel";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";
import { shuffledIllustrations } from "@/lib/illustrations";
import { EXPERIENCES } from "@/lib/experiences";

// hydrangea / petals-scattered / leaf-sprig are already placed elsewhere on
// this page (intro card, Our Story, Dining teaser) — filtered out here so the
// two newly-added sections below never repeat one of those.
const homeIllustrations = shuffledIllustrations("/").filter(
  (n) => !["hydrangea", "petals-scattered", "leaf-sprig"].includes(n)
);

// Homepage bypasses the layout's title template (via `title.absolute`) since
// its title already stands alone — appending "| Doris Mountain Boutique
// Hotel" a second time would be redundant on the one page that IS the brand.
export const metadata: Metadata = {
  title: { absolute: "Doris Mountain Boutique Hotel — A Mountain Home Above the Valley" },
  description:
    "A mountain home above the Kangra valley in Dharamshala, Himachal Pradesh — twenty-five rooms, a fourth-floor glass restaurant, and terrace views of the Dhauladhar range.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Doris Mountain Boutique Hotel — A Mountain Home Above the Valley",
    description:
      "A mountain home above the Kangra valley in Dharamshala, Himachal Pradesh — twenty-five rooms, a fourth-floor glass restaurant, and terrace views of the Dhauladhar range.",
    url: "/",
    siteName: "Doris Mountain Boutique Hotel",
    images: [{ url: "/assets/photos/optimized/hero-poster.jpg", width: 1280, height: 720 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doris Mountain Boutique Hotel — A Mountain Home Above the Valley",
    images: ["/assets/photos/optimized/hero-poster.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <section className="relative h-screen min-h-[640px] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/videos/optimized/hero.mp4"
          poster="/assets/photos/optimized/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative h-full flex flex-col items-start justify-center px-6 md:px-20">
          <div className="text-xs tracking-[0.18em] uppercase text-cream mb-5">
            Dharamshala · Himachal Pradesh
          </div>
          <h1 className="font-serif font-medium text-[46px] sm:text-[72px] md:text-[104px] lg:text-[124px] leading-[0.98] text-cream max-w-[1100px]">
            A mountain<br />home above<br />the valley
          </h1>
        </div>
        <div className="absolute bottom-9 left-0 right-0 flex justify-center">
          <div className="w-px h-11 bg-cream/60" />
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-20 relative z-10 -mt-16">
        <Reveal>
          <div className="relative overflow-hidden bg-cream border border-line px-6 md:px-14 py-10 flex justify-between items-center flex-wrap gap-7 shadow-[0_20px_50px_rgba(36,31,26,0.08)]">
            <Illustration name="hydrangea" className="absolute -top-6 -right-4 w-14 sm:w-24 lg:w-36 rotate-12" />
            <p className="text-base leading-relaxed text-[#59504A] max-w-[56ch] m-0">
              Doris sits a short drive from McLeod Ganj, with terrace views of the Dhauladhar
              range, a glass-walled restaurant on the fourth floor, and rooms dressed simply and
              well.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/rooms" className="bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-7 py-4 no-underline whitespace-nowrap">
                <CtaBloom seed="home-intro-rooms-rates" />
                <span>View Rooms & Rates</span>
              </Link>
              <Link href="/contact" className="cta-btn cta-btn--outline border border-ink text-ink text-[13px] tracking-wide uppercase px-7 py-4 no-underline whitespace-nowrap">
                <CtaBloom seed="home-intro-enquire" />
                <span>Enquire</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-20 pt-10 pb-32">
        <Reveal className="grid md:grid-cols-[0.9fr_1.1fr] gap-16 items-end">
          <div className="relative">
            <Placeholder label="story photo" className="h-[340px] sm:h-[440px] md:h-[520px]" src="/assets/photos/optimized/balconyday-1.jpg" />
            {/* Offset shrinks on small screens — at -left-10 the overlap bled past the
                24px page gutter and forced the whole page to horizontal-scroll on phones,
                since an absolutely-positioned element with a negative offset expands
                document scrollWidth regardless of the parent's own overflow setting. */}
            <Placeholder label="story photo detail" className="h-[140px] sm:h-[180px] md:h-[220px] w-3/5 absolute -left-4 sm:-left-6 md:-left-10 -bottom-8 sm:-bottom-12 md:-bottom-16 border-4 md:border-8 border-cream z-10" src="/assets/photos/optimized/balconynight-2.jpg" />
          </div>
          <div className="relative overflow-hidden">
            <Illustration name="petals-scattered" className="absolute -top-4 right-0 w-12 sm:w-20 md:w-28 lg:w-32" />
            <div className="text-xs tracking-[0.14em] uppercase text-terracotta mb-4">Our Story</div>
            <blockquote className="font-serif italic text-[26px] md:text-[40px] leading-[1.3] mb-6">
              &ldquo;Doris was built for travellers who come for the mountains and stay for the
              quiet.&rdquo;
            </blockquote>
            <p className="text-[15px] leading-relaxed text-muted max-w-[46ch] mb-5">
              Run by Hotel Royal Oasis, every room at Doris looks out toward the Dhauladhar
              range, and every evening ends on the open terrace.
            </p>
            <Link href="/about" className="text-[13px] border-b border-terracotta pb-1 no-underline">
              Read our story &rarr;
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="bg-ink py-24 px-6 md:px-20 relative overflow-hidden">
        {/* Lower opacity than the sitewide default (0.28) — same reasoning as
            the footer: these are light cream illustrations, and against the
            dark ink background here they'd otherwise glow rather than sit as
            a quiet texture behind the quote. */}
        <Illustration name={homeIllustrations[0]} className="absolute top-6 left-6 sm:left-10 w-12 sm:w-20 md:w-28 lg:w-32 rotate-6" opacity={0.16} />
        <Reveal className="max-w-[900px] mx-auto text-center">
          <div className="font-serif italic text-2xl md:text-4xl leading-relaxed text-cream">
            Twenty-five rooms. One view worth the drive.
          </div>
        </Reveal>
      </section>

      <section className="relative overflow-hidden max-w-[1400px] mx-auto px-6 md:px-20 pt-28 pb-24">
        {/* Sits inside the section's own pt-28 top padding, above the heading
            row entirely, so it never overlaps "Rooms & Suites" or the "See
            all rooms" link beside it. */}
        <Illustration name={homeIllustrations[1]} className="absolute top-2 right-4 sm:right-6 w-10 sm:w-16 lg:w-20 rotate-[-8deg]" />
        <Reveal>
          <div className="flex justify-between items-baseline flex-wrap gap-3 mb-10">
            <h2 className="font-serif text-3xl md:text-[42px]">Rooms & Suites</h2>
            <Link href="/rooms" className="text-[13px] border-b border-terracotta pb-1 no-underline">
              See all rooms & tariff &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-7">
            <Link href="/rooms/deluxe" className="no-underline text-inherit block">
              <Placeholder label="deluxe room photo" className="h-[440px] mb-5" src="/assets/photos/optimized/deluxe.jpg" />
              <div className="font-serif text-2xl mb-2">Deluxe Room</div>
              <div className="text-sm text-muted mb-2">Double occupancy · 13 rooms · Our largest rooms, closest to the terrace</div>
              <div className="text-[13px] text-terracotta border-b border-terracotta inline-block pb-0.5">Enquire Now for Pricing</div>
            </Link>
            <Link href="/rooms/executive" className="no-underline text-inherit block">
              <Placeholder label="executive room photo" className="h-[440px] mb-5" src="/assets/photos/optimized/room-interior.jpg" />
              <div className="font-serif text-2xl mb-2">Executive Room</div>
              <div className="text-sm text-muted mb-2">Double occupancy · 12 rooms</div>
              <div className="text-[13px] text-terracotta border-b border-terracotta inline-block pb-0.5">Enquire Now for Pricing</div>
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="bg-sand py-24 px-6 md:px-20 relative overflow-hidden">
        <Illustration name="leaf-sprig" className="absolute top-6 sm:top-10 left-4 sm:left-6 w-14 sm:w-20 lg:w-32 rotate-[-8deg]" />
        <Reveal>
          <div className="grid md:grid-cols-2 max-w-[1400px] mx-auto min-h-[440px] items-stretch">
            <div className="flex flex-col justify-center md:pr-14">
              <div className="text-xs tracking-[0.14em] uppercase text-terracotta mb-4">Dining</div>
              <h2 className="font-serif text-3xl md:text-[42px] leading-tight mb-5">
                A glass restaurant, four floors up
              </h2>
              <p className="text-[15px] leading-relaxed text-muted max-w-[46ch] mb-5">
                Seating for 90 inside and out on the open terrace, with the Dhauladhar range as
                backdrop for breakfast, mountain-view lunches, and slow dinners.
              </p>
              <Link href="/dining" className="text-[13px] border-b border-terracotta pb-1 no-underline">
                Explore dining &rarr;
              </Link>
            </div>
            <Placeholder label="restaurant photo" className="min-h-[400px]" src="/assets/photos/optimized/indoors-1.jpg" />
          </div>
        </Reveal>
      </section>

      <section className="pt-24 pb-24">
        <Reveal>
          <div className="px-6 md:px-20 max-w-[1400px] mx-auto">
            <div className="text-xs tracking-[0.14em] uppercase text-terracotta mb-4">Nearby</div>
            <h2 className="font-serif text-3xl md:text-[42px] mb-8">Minutes from McLeod Ganj and Triund</h2>
          </div>
          {/* All 12 experiences, not a hand-picked 4 — previously this carousel
              only showed McLeod Ganj/Triund/Bhagsu Nag/Dharamkot from its own
              inline list, which had drifted out of sync with the full set on
              /experiences. Now both read from the same lib/experiences.ts, so
              every card that exists there shows up here too. */}
          <Carousel className="px-6 md:px-20">
            {EXPERIENCES.map(({ title, desc, photo }) => (
              <div key={title} data-carousel-item className="w-[300px]">
                <Placeholder label={`${title} photo`} className="h-[220px] mb-4" src={`/assets/photos/optimized/experiences/${photo}.jpg`} />
                <div className="font-serif text-lg mb-1">{title}</div>
                <div className="text-[13.5px] text-muted">{desc}</div>
              </div>
            ))}
          </Carousel>
          <div className="px-6 md:px-20 max-w-[1400px] mx-auto mt-7">
            <Link href="/experiences" className="text-[13px] border-b border-terracotta pb-1 no-underline">
              See all nearby experiences &rarr;
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 md:px-20 pb-24">
        <Reveal>
          <div className="flex justify-between items-baseline flex-wrap gap-3 mb-6">
            <h2 className="font-serif text-3xl">Gallery</h2>
            <Link href="/gallery" className="text-[13px] border-b border-terracotta pb-1 no-underline">
              View full gallery &rarr;
            </Link>
          </div>
          {/* Mobile uses explicit auto-rows (grid-cols-1 stacks all 5 items into one
              column, needing 6 row-slots since the kitchen photo spans 2) — the old
              fixed h-[460px] + grid-rows-2 only defined 2 row tracks, so on a single
              column the other implicit rows fell back to auto-height with no
              intrinsic content size (Placeholder's Image is absolutely `fill`-
              positioned) and collapsed to 0px, making 4 of the 5 photos invisible on
              phones. auto-rows-[170px] gives every stacked row real height; the
              desktop 3-column layout is untouched via md:grid-rows-2 md:h-[460px]. */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] auto-rows-[170px] md:grid-rows-2 md:auto-rows-auto gap-4 md:h-[460px]">
            <Placeholder label="photo" className="row-span-2" src="/assets/photos/optimized/kitchen.jpg" />
            <Placeholder label="photo" src="/assets/photos/optimized/viewing-2.jpg" />
            <Placeholder label="photo" src="/assets/photos/optimized/hallway-view.jpg" />
            <Placeholder label="photo" src="/assets/photos/optimized/indoors-2.jpg" />
            <Placeholder label="photo" src="/assets/photos/optimized/hallway-art.jpg" />
          </div>
        </Reveal>
      </section>

    </>
  );
}
