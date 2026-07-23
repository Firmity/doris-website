import Placeholder from "@/components/Placeholder";
import Illustration from "@/components/Illustration";
import { shuffledIllustrations } from "@/lib/illustrations";
import { pageMetadata } from "@/lib/seo";

// leaf-sprig / eucalyptus are already placed elsewhere on this page — filter
// them out so the card-grid section below never repeats one of those.
const diningIllustrations = shuffledIllustrations("/dining").filter(
  (n) => !["leaf-sprig", "eucalyptus"].includes(n)
);

export const metadata = pageMetadata({
  title: "Dining",
  description:
    "The glass restaurant on Doris's fourth floor — seating for 90 inside and on the open terrace, with the Dhauladhar range as backdrop for breakfast, lunch, and dinner.",
  path: "/dining",
  image: "/assets/photos/optimized/kitchen.jpg",
});

export default function Dining() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="dining hero photo" className="absolute inset-0" src="/assets/photos/optimized/kitchen.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Dining</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">The glass restaurant, fourth floor</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1000px] mx-auto px-6 md:px-20 pt-20 pb-10">
        <Illustration name="leaf-sprig" className="absolute top-10 right-0 w-14 sm:w-28 md:w-36 -rotate-12" />
        <p className="relative z-10 text-[15px] leading-relaxed text-muted">
          Doris's restaurant seats 90 behind full-height glass, with the Dhauladhar range filling
          the view on clear mornings. An open terrace extends the same room outdoors for evenings
          when the weather holds.
        </p>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24 grid gap-6 grid-cols-1 sm:grid-cols-3">
        {/* Contained fully inside the section's own px-20 gutter (no negative
            offsets) — a wider/negatively-offset shape here either got cut by
            this section's overflow-hidden or bled onto the photo cards. */}
        <Illustration name={diningIllustrations[0]} className="absolute top-2 right-2 w-8 sm:w-12 lg:w-16 rotate-6" />
        {[
          ["Glass Restaurant", "90 seats · 4th floor · mountain view", "/assets/photos/optimized/indoors-1.jpg"],
          ["Open Terrace", "90 pax · open-air dining, party hall attached", "/assets/photos/optimized/balconyday-1.jpg"],
          ["Private Dining", "30–35 seats · ground floor", "/assets/photos/optimized/indoors-2.jpg"],
        ].map(([title, desc, photo]) => (
          <div key={title}>
            <Placeholder label="photo" className="h-[260px] mb-4" src={photo} />
            <div className="font-serif text-lg mb-1">{title}</div>
            <div className="text-[13.5px] text-muted">{desc}</div>
          </div>
        ))}
      </section>

      <section className="bg-sand relative overflow-hidden">
        <Illustration name="eucalyptus" className="absolute top-6 right-6 w-14 sm:w-20 md:w-28 lg:w-36 rotate-[14deg]" />
        <div className="relative z-10 max-w-[1000px] mx-auto px-6 md:px-20 py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Outdoor catering</h2>
          <p className="text-[14.5px] leading-relaxed text-muted max-w-[60ch] mx-auto">
            Doris also caters events off-property — for weddings, gatherings, and functions across
            Dharamshala.
          </p>
        </div>
      </section>
    </>
  );
}
