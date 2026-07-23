import Illustration from "@/components/Illustration";
import EnquiryForm from "@/components/EnquiryForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact & Location",
  description:
    "Get in touch with Doris Mountain Boutique Hotel — Vill. Shivnagar, Dharamshala, Himachal Pradesh. Phone, email, and enquiry form for bookings and rates.",
  path: "/contact",
});

// Keyless Google Maps embed (maps.google.com/maps?...&output=embed) — no API
// key/billing needed, unlike the official Maps Embed API. Trade-off: it's an
// unofficial-but-widely-used endpoint, not a documented, versioned API, so
// Google could change its behavior without notice. If that ever happens,
// swap this for the real Maps Embed API (needs a key + billing enabled at
// console.cloud.google.com) — the iframe usage below wouldn't need to change,
// just this URL.
const HOTEL_ADDRESS =
  "Doris Mountain Boutique Hotel, Vill. Shivnagar, Post Office Garoh, Dharamshala, District Kangra, Himachal Pradesh 176217, India";
const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(HOTEL_ADDRESS)}&output=embed`;
const MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_ADDRESS)}`;

export default function Contact() {
  return (
    <>
      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pt-[150px] pb-24 grid md:grid-cols-2 gap-16">
        <Illustration name="babys-breath" className="absolute top-10 right-8 w-14 sm:w-24 lg:w-32 rotate-6" />
        <Illustration name="lavender" className="absolute bottom-4 left-4 w-14 sm:w-24 md:w-28 lg:w-36 rotate-[-10deg]" />
        <div>
          <div className="text-xs tracking-[0.16em] uppercase text-terracotta mb-3">Contact</div>
          <h1 className="font-serif text-3xl md:text-4xl mb-7">Get in touch</h1>
          <div className="text-[15px] leading-loose text-[#3A332C] mb-7">
            Doris Mountain Boutique Hotel<br />
            Vill. Shivnagar, Post Office Garoh<br />
            Opp. Rana Himalayan Tyres<br />
            Dharamshala, District Kangra – 176217<br />
            Himachal Pradesh, India
          </div>
          <div className="flex flex-col gap-1.5 text-[15px] mb-7">
            <a href="mailto:dorismbhotel@gmail.com">dorismbhotel@gmail.com</a>
            <a href="tel:+919317371655">93173 71655</a>
            <a href="tel:+919914472730">99144 72730</a>
          </div>
          <div className="text-[13px] text-muted mb-9">Hotel Royal Oasis · GST 02APNPP1626H1Z0</div>
          <div className="border border-line overflow-hidden">
            <iframe
              src={MAP_EMBED_URL}
              title="Doris Mountain Boutique Hotel — map location"
              className="w-full h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-[13px] border-b border-terracotta pb-0.5"
          >
            Open in Google Maps &rarr;
          </a>
        </div>
        <EnquiryForm />
      </section>
    </>
  );
}
