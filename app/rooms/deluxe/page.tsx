import Placeholder from "@/components/Placeholder";
import Link from "next/link";
import Icon, { matchIcon } from "@/components/Icon";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";
import { shuffledIllustrations } from "@/lib/illustrations";
import { pageMetadata } from "@/lib/seo";

// cherry-blossom / pink-flower are already placed elsewhere on this page —
// filtered out so the photo-grid and Rates & plans sections below never
// repeat one of those, or each other (each pulls a different index).
const deluxeIllustrations = shuffledIllustrations("/rooms/deluxe").filter(
  (n) => !["cherry-blossom", "pink-flower"].includes(n)
);

export const metadata = pageMetadata({
  title: "Deluxe Room",
  description:
    "Doris's Deluxe Rooms — thirteen of our largest rooms, double occupancy, closest to the terrace and fourth-floor restaurant, with mountain-facing views of the Dhauladhar range.",
  path: "/rooms/deluxe",
  image: "/assets/photos/optimized/deluxe.jpg",
});

export default function DeluxeRoom() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="deluxe room hero photo" className="absolute inset-0" src="/assets/photos/optimized/deluxe.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Deluxe Room</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Our largest rooms, closest to the terrace</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pt-20 pb-10 grid md:grid-cols-[1.2fr_1fr] gap-14">
        <Illustration name="cherry-blossom" className="absolute top-6 right-6 w-12 sm:w-16 lg:w-24 rotate-12" />
        <p className="relative z-10 text-[15px] leading-relaxed text-muted">
          Deluxe Rooms are the larger of the two categories at Doris — more space, the same mountain-facing outlook, and easy access to the open terrace and fourth-floor restaurant. Thirteen rooms in total, double occupancy.
        </p>
        <div className="relative overflow-hidden bg-sand border border-line px-6 py-7">
          <Illustration name={deluxeIllustrations[1]} className="absolute -top-3 -right-3 w-14 sm:w-16 rotate-[14deg]" opacity={0.2} />
          <div className="relative z-10 text-xs tracking-wider uppercase text-terracotta mb-3">Rates & plans</div>
          <p className="relative z-10 text-[14px] leading-relaxed text-muted mb-5">
            Available on EP (room only), CP (with breakfast), and MAP (breakfast &amp; dinner)
            plans, with extra-bed options on request.
          </p>
          <Link href="/contact" className="inline-block bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-6 py-3.5 no-underline">
            <CtaBloom seed="deluxe-rates-cta" />
            <span>Enquire Now for Pricing</span>
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24">
        {/* Small enough at every breakpoint to stay inside the section's own
            gutter without ever touching the photo grid beside it. */}
        <Illustration name={deluxeIllustrations[0]} className="absolute top-4 right-2 w-8 sm:w-12 lg:w-16 rotate-6" />
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 h-[420px]">
          <Placeholder label="room photo" className="row-span-2" src="/assets/photos/optimized/room-deluxe-alt.jpg" />
          <Placeholder label="room photo" src="/assets/photos/optimized/room-rose-petal.jpg" />
          <Placeholder label="room photo" src="/assets/photos/optimized/deluxe.jpg" />
        </div>
      </section>

      <section className="bg-sand relative overflow-hidden">
        <Illustration name="pink-flower" className="absolute -bottom-6 -right-6 w-16 sm:w-24 md:w-32 lg:w-40 -rotate-6" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-20 py-20">
          <h2 className="font-serif text-2xl md:text-3xl mb-7">In every room</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {["Split AC","Tea / coffee maker","Android TV with channels","Study chair","Intercom & wake-up service","Toiletries & one bottle water","Room service","Toiletry kit on request"].map((a) => (
              <div key={a} className="flex items-center gap-3 bg-cream border border-line px-3.5 py-3">
                <Icon name={matchIcon(a)} className="w-4 h-4 text-terracotta shrink-0" />
                <span className="text-[13.5px] text-ink">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
