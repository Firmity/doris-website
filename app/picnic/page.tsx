import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";
import { shuffledIllustrations } from "@/lib/illustrations";
import { pageMetadata } from "@/lib/seo";

// pink-flower / hydrangea are already placed elsewhere on this page —
// filtered out so the card-grid section below never repeats one.
const picnicIllustrations = shuffledIllustrations("/picnic").filter(
  (n) => !["pink-flower", "hydrangea"].includes(n)
);

export const metadata = pageMetadata({
  title: "Picnic Packages",
  description:
    "Day-picnic packages at Doris Mountain Boutique Hotel — terrace access, a set mountain-view meal, and pool/lounge time near McLeod Ganj, Dharamshala.",
  path: "/picnic",
  image: "/assets/photos/optimized/balconyday-2.jpg",
});

export default function Picnic() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="picnic hero photo" className="absolute inset-0" src="/assets/photos/optimized/balconyday-2.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Picnic</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">A day in the mountains</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[900px] mx-auto px-6 md:px-20 pt-20 pb-10">
        <Illustration name="pink-flower" className="absolute top-8 right-2 w-14 sm:w-28 md:w-36 rotate-[10deg]" />
        <p className="relative z-10 text-[15px] leading-relaxed text-muted">
          Not staying the night? Spend the day at Doris instead. Our day-picnic package opens up
          the terrace, lounge, and grounds for a few relaxed hours with the Dhauladhar range as
          the backdrop — no room required.
        </p>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24 grid gap-7 grid-cols-1 sm:grid-cols-3">
        <Illustration name={picnicIllustrations[0]} className="absolute top-2 right-2 w-8 sm:w-12 lg:w-16 rotate-[10deg]" />
        {[
          ["Terrace & Lounge Access", "Open-air seating on the fourth-floor terrace for the full duration of your visit", "/assets/photos/optimized/balconyday-1.jpg"],
          ["Set Meal", "A fixed mountain-view lunch or evening menu, vegetarian and non-vegetarian options", "/assets/photos/optimized/indoors-1.jpg"],
          ["Games & Leisure", "Board games, music, and space to just sit with the view — ideal for small groups and families", "/assets/photos/optimized/balconynight-2.jpg"],
        ].map(([title, desc, photo]) => (
          <div key={title}>
            <Placeholder label="photo" className="h-[220px] mb-4" src={photo} />
            <div className="font-serif text-lg mb-1">{title}</div>
            <div className="text-[13.5px] text-muted">{desc}</div>
          </div>
        ))}
      </section>

      <section className="bg-sand relative overflow-hidden">
        <Illustration name="hydrangea" className="absolute bottom-6 right-6 w-14 sm:w-20 md:w-28 lg:w-36 rotate-6" />
        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-20 py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Plan your day visit</h2>
          <p className="text-[14.5px] leading-relaxed text-muted mb-6">
            Picnic slots are limited on weekends and during peak season — enquire ahead to
            confirm availability and group size.
          </p>
          <Link href="/contact" className="inline-block bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-6 py-3.5 no-underline">
            <CtaBloom seed="picnic-plan-cta" />
            <span>Enquire Now</span>
          </Link>
        </div>
      </section>
    </>
  );
}
