import Placeholder from "@/components/Placeholder";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";
import Link from "next/link";
import { shuffledIllustrations } from "@/lib/illustrations";
import { pageMetadata } from "@/lib/seo";

// wildflower-spray / wildflower-bouquet are already placed elsewhere on this
// page — filtered out so the card-grid section below never repeats one.
const eventsIllustrations = shuffledIllustrations("/events").filter(
  (n) => !["wildflower-spray", "wildflower-bouquet"].includes(n)
);

export const metadata = pageMetadata({
  title: "Events & Weddings",
  description:
    "Weddings, conferences, and celebrations at Doris Mountain Boutique Hotel — a banquet hall, terrace party hall, and conference area for up to 90 guests, Dharamshala.",
  path: "/events",
  image: "/assets/photos/optimized/balconynight-2.jpg",
});

export default function Events() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="events hero photo" className="absolute inset-0" src="/assets/photos/optimized/balconynight-2.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Events & Weddings</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Gather in the mountains</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1000px] mx-auto px-6 md:px-20 pt-20 pb-10">
        <Illustration name="wildflower-spray" className="absolute top-6 right-2 w-14 sm:w-32 md:w-40 rotate-6" />
        <p className="relative z-10 text-[15px] leading-relaxed text-muted">
          From an intimate ceremony on the open terrace to a full banquet for ninety, Doris hosts
          weddings, conferences, and celebrations with the Dhauladhar range as backdrop.
        </p>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24 grid gap-7 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Illustration name={eventsIllustrations[0]} className="absolute top-2 right-2 w-8 sm:w-12 lg:w-16 rotate-[-8deg]" />
        {[
          ["Banquet Hall", "Capacity 90 · indoor, for weddings & large functions", "/assets/photos/optimized/indoors-1.jpg"],
          ["Terrace Party Hall", "Capacity 90 · open terrace with attached hall", "/assets/photos/optimized/balconynight-1.jpg"],
          ["Conference Area", "30–35 pax · ground floor", "/assets/photos/optimized/hallway-art.jpg"],
          ["Private Dining Area", "30–35 seats · ground floor", "/assets/photos/optimized/indoors-2.jpg"],
        ].map(([title, desc, photo]) => (
          <div key={title}>
            <Placeholder label="photo" className="h-[260px] mb-4" src={photo} />
            <div className="font-serif text-lg mb-1">{title}</div>
            <div className="text-[13.5px] text-muted">{desc}</div>
          </div>
        ))}
      </section>

      <section className="bg-sand relative overflow-hidden">
        <Illustration name="wildflower-bouquet" className="absolute bottom-6 left-6 w-14 sm:w-20 md:w-28 lg:w-36 -rotate-6" />
        <div className="max-w-[900px] mx-auto px-6 md:px-20 py-20 text-center relative">
          <h2 className="font-serif text-2xl md:text-3xl mb-4">Plan your event</h2>
          <p className="text-[14.5px] leading-relaxed text-muted mb-6">
            Outdoor catering available for off-property events across Dharamshala.
          </p>
          <Link href="/contact" className="inline-block bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-6 py-3.5 no-underline">
            <CtaBloom seed="events-plan-cta" />
            <span>Enquire</span>
          </Link>
        </div>
      </section>
    </>
  );
}
