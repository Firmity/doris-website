import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import Icon, { matchIcon } from "@/components/Icon";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";
import { shuffledIllustrations } from "@/lib/illustrations";
import { pageMetadata } from "@/lib/seo";

// eucalyptus / wildflower-bouquet are already placed elsewhere on this page
// — filtered out so the three sections below never repeat one of those, or
// each other (each pulls a different index).
const roomsIllustrations = shuffledIllustrations("/rooms").filter(
  (n) => !["eucalyptus", "wildflower-bouquet"].includes(n)
);

export const metadata = pageMetadata({
  title: "Rooms & Suites",
  description:
    "Twenty-five mountain-facing rooms across two categories — Executive and Deluxe — at Doris Mountain Boutique Hotel, Dharamshala. Split AC, Android TV, and views of the Dhauladhar range.",
  path: "/rooms",
  image: "/assets/photos/optimized/deluxe.jpg",
});

const amenities = [
  "Tea / coffee maker","Dental kit (on request)","Shaving kit (on request)","Shower cap (on request)",
  "Comb (on request)","Fan","Android TV with channels","One bottle packaged water (1L)","Intercom",
  "Wake-up call / service","Toiletries","Study chair","Room service","Doctor on call",
];
const facilities = [
  "AC rooms with split AC","Car parking","24 hrs. security","Business centre",
  "90-seat glass restaurant, 4th floor, mountain view","90-capacity banquet hall","Outdoor catering services",
  "Conference area, 30–35 pax, ground floor","Private dining area, 30–35 seats, ground floor","Free wifi access",
  "Laundry service (outsourced)","Smoking zone","Open terrace with attached party hall, 90 pax",
  "Power backup","Elevator / lift","Wheelchair access",
];

export default function Rooms() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="rooms hero photo" className="absolute inset-0" src="/assets/photos/optimized/deluxe.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Stay</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Rooms & Suites</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pt-20 pb-10">
        <Illustration name={roomsIllustrations[0]} className="absolute top-2 left-2 w-16 sm:w-24 md:w-32 lg:w-36 rotate-6" />
        <p className="relative z-10 text-[15px] leading-relaxed text-muted max-w-[60ch]">
          Twenty-five rooms across two categories — Executive and Deluxe — each with split AC, an
          Android TV, and a view toward the Dhauladhar range. Choose European Plan (room only),
          Continental Plan (with breakfast), or Modified American Plan (breakfast and dinner).
        </p>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24 grid gap-7 grid-cols-1 sm:grid-cols-2">
        <Illustration name={roomsIllustrations[1]} className="absolute top-2 right-2 w-14 sm:w-20 md:w-28 lg:w-32 rotate-[-6deg]" />
        <Link href="/rooms/executive" className="no-underline text-inherit">
          <Placeholder label="executive room photo" className="h-[300px] mb-5" src="/assets/photos/optimized/room-interior.jpg" />
          <div className="font-serif text-2xl mb-2">Executive Room</div>
          <div className="text-sm text-muted mb-3">Double occupancy · 12 rooms</div>
          <div className="text-[13px] text-terracotta">View room &rarr;</div>
        </Link>
        <Link href="/rooms/deluxe" className="no-underline text-inherit">
          <Placeholder label="deluxe room photo" className="h-[300px] mb-5" src="/assets/photos/optimized/deluxe.jpg" />
          <div className="font-serif text-2xl mb-2">Deluxe Room</div>
          <div className="text-sm text-muted mb-3">Double occupancy · 13 rooms</div>
          <div className="text-[13px] text-terracotta">View room &rarr;</div>
        </Link>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24">
        <Illustration name={roomsIllustrations[2]} className="absolute top-2 left-2 w-14 sm:w-20 md:w-28 lg:w-32 rotate-12" />
        <div className="relative overflow-hidden bg-sand border border-line px-6 md:px-14 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-7">
          <Illustration name={roomsIllustrations[3]} className="absolute -top-4 -right-4 w-16 sm:w-20 rotate-[14deg]" opacity={0.2} />
          <div className="relative z-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Rates & plans</h2>
            <p className="text-[14.5px] leading-relaxed text-muted max-w-[56ch]">
              Executive and Deluxe rooms are both available on EP (room only), CP (with
              breakfast), and MAP (breakfast &amp; dinner) plans, with extra-bed options on
              request. Send us your dates and we&rsquo;ll confirm current rates and availability.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-terracotta cta-btn text-cream text-[13px] tracking-wide uppercase px-7 py-4 no-underline whitespace-nowrap"
          >
            <CtaBloom seed="rooms-rates-cta" />
            <span>Enquire Now for Pricing</span>
          </Link>
        </div>
      </section>

      <section className="bg-sand relative overflow-hidden">
        <Illustration name="eucalyptus" className="absolute top-8 left-6 w-16 sm:w-24 md:w-32 lg:w-36 rotate-12" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-20 py-24">
          <div className="text-xs tracking-[0.14em] uppercase text-terracotta mb-3">In every room</div>
          <h2 className="font-serif text-2xl md:text-3xl mb-9">Room amenities</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <div key={a} className="flex items-center gap-3.5 bg-cream border border-line px-4 py-3.5">
                <Icon name={matchIcon(a)} className="w-5 h-5 text-terracotta shrink-0" />
                <span className="text-[13.5px] text-ink">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 py-24">
        <Illustration name="wildflower-bouquet" className="absolute top-10 right-2 w-16 sm:w-24 md:w-28 lg:w-32 rotate-6" />
        <div className="relative z-10 text-xs tracking-[0.14em] uppercase text-terracotta mb-3">On the property</div>
        <h2 className="relative z-10 font-serif text-2xl md:text-3xl mb-9">Hotel facilities & services</h2>
        <div className="relative z-10 grid gap-3 grid-cols-1 md:grid-cols-2">
          {facilities.map((f) => (
            <div key={f} className="flex items-start gap-3.5 bg-white border border-line px-4 py-3.5 shadow-[0_2px_10px_rgba(36,31,26,0.04)]">
              <Icon name={matchIcon(f)} className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <span className="text-[13.5px] text-ink leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
