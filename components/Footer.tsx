import Link from "next/link";
import Image from "next/image";
import Illustration from "@/components/Illustration";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-[#DDD3C7] px-6 md:px-14 pt-16 pb-8">
      {/* Lower opacity than the sitewide default (0.28) on purpose — these
          illustrations are light cream line art, so against the dark ink
          background they read far more strongly than they do on the cream/
          sand sections elsewhere. 0.10–0.13 keeps them a quiet texture instead
          of a glowing patch behind the footer columns. babys-breath /
          petals-scattered were picked deliberately over the bolder florals
          used elsewhere (wildflower-bouquet, eucalyptus) — their finer,
          airier linework reads as "lighter" even before the opacity drop. */}
      <Illustration name="babys-breath" className="absolute -top-8 -right-10 w-24 sm:w-36 md:w-52 lg:w-64 rotate-12" opacity={0.13} />
      <Illustration name="petals-scattered" className="absolute bottom-0 left-[30%] w-20 sm:w-28 lg:w-40 -rotate-6" opacity={0.1} />
      <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-[#453C33]">
        <div>
          <div className="font-serif text-2xl text-cream mb-3">Doris</div>
          <p className="text-[13.5px] leading-relaxed text-[#C9BFB2] max-w-[32ch] mb-5">
            Doris Mountain Boutique Hotel, Vill. Shivnagar, Post Office Garoh, Opp. Rana Himalayan
            Tyres, Dharamshala, District Kangra – 176217, Himachal Pradesh
          </p>
          <Image
            src="/assets/photos/optimized/banner.jpg"
            alt="Doris — property highlights"
            width={220}
            height={136}
            className="border border-[#453C33] object-cover w-[200px] h-auto"
          />
        </div>
        <div>
          <div className="text-xs tracking-wider uppercase text-terracotta mb-3">Explore</div>
          <div className="flex flex-col gap-2 text-[13.5px]">
            <Link href="/rooms" className="text-[#DDD3C7] no-underline">Rooms & Suites</Link>
            <Link href="/dining" className="text-[#DDD3C7] no-underline">Dining</Link>
            <Link href="/events" className="text-[#DDD3C7] no-underline">Events & Weddings</Link>
            <Link href="/picnic" className="text-[#DDD3C7] no-underline">Picnic</Link>
            <Link href="/gallery" className="text-[#DDD3C7] no-underline">Gallery</Link>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-wider uppercase text-terracotta mb-3">Hotel</div>
          <div className="flex flex-col gap-2 text-[13.5px]">
            <Link href="/about" className="text-[#DDD3C7] no-underline">Our Story</Link>
            <Link href="/experiences" className="text-[#DDD3C7] no-underline">Nearby Experiences</Link>
            <Link href="/contact" className="text-[#DDD3C7] no-underline">Contact & Location</Link>
          </div>
        </div>
        <div>
          <div className="text-xs tracking-wider uppercase text-terracotta mb-3">Reach us</div>
          <div className="flex flex-col gap-2 text-[13.5px]">
            <a href="mailto:dorismbhotel@gmail.com" className="text-[#DDD3C7] no-underline">dorismbhotel@gmail.com</a>
            <a href="tel:+919317371655" className="text-[#DDD3C7] no-underline">93173 71655</a>
            <a href="tel:+919914472730" className="text-[#DDD3C7] no-underline">99144 72730</a>
          </div>
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-2 pt-6 text-xs text-[#9C9184]">
        <span>&copy; 2026 Doris Mountain Boutique Hotel · A Hotel Royal Oasis property</span>
        <span>GST 02APNPP1626H1Z0</span>
      </div>
    </footer>
  );
}
