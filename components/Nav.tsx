"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Illustration from "@/components/Illustration";
import CtaBloom from "@/components/CtaBloom";

const LINKS: [string, string][] = [
  ["Rooms & Suites", "/rooms"],
  ["Dining", "/dining"],
  ["Experiences", "/experiences"],
  ["Events & Weddings", "/events"],
  ["Picnic", "/picnic"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
];

// Per-route transparency. Every page with a photo hero floats a transparent
// nav over it (solidifying on scroll); Contact is the one exception — its
// content starts directly under the nav with no image behind it, so it needs
// an opaque bar from the top for text contrast. Rooms and Gallery used to be
// solid-from-load too, but both now have their own hero image, so they were
// moved to the transparent group for a consistent feel site-wide.
const SOLID_ROUTES = new Set(["/contact"]);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const transparent = !SOLID_ROUTES.has(pathname ?? "");
  const solid = scrolled || !transparent;
  const textColor = solid ? "text-ink" : "text-cream";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-3 overflow-hidden transition-colors duration-300 ${
          solid ? "bg-cream shadow-sm" : "bg-transparent"
        }`}
      >
        {/* Purely decorative — a single accent so the bar doesn't feel bare next to the
            logo, kept to desktop-only and very low opacity so it never fights the logo
            or links for attention. */}
        <Illustration
          name="cherry-blossom"
          className="hidden lg:block absolute -top-3 left-[38%] w-16 rotate-[18deg]"
          opacity={solid ? 0.82 : 0}
        />
        <Link href="/" className="relative flex items-center" aria-label="Doris — home">
          <Image
            src="/assets/photos/optimized/doris-logo.png"
            alt="Doris"
            width={120}
            height={80}
            priority
            className={`h-12 md:h-14 w-auto object-contain transition-[filter] duration-300 ${
              solid ? "" : "drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            }`}
          />
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`text-[13px] tracking-wide no-underline border-b pb-1 ${textColor} ${
                pathname === href ? "border-current opacity-100" : "border-transparent opacity-80"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="hidden md:inline-block bg-terracotta cta-btn text-cream text-xs tracking-wider uppercase px-5 py-3 no-underline"
        >
          <CtaBloom seed="nav-desktop-enquire" />
          <span>Enquire</span>
        </Link>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-[200]"
        >
          <span className={`block w-full h-[2px] ${solid ? "bg-ink" : "bg-cream"}`} />
          <span className={`block w-full h-[2px] ${solid ? "bg-ink" : "bg-cream"}`} />
          <span className={`block w-full h-[2px] ${solid ? "bg-ink" : "bg-cream"}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[300] bg-cream overflow-hidden">
          {/* Decorative backdrop for the full-screen mobile menu — four illustrations
              scattered at low opacity so the overlay doesn't read as a bare block of
              color. z-0 keeps them strictly behind the links (z-10) and pointer-events
              are already disabled on Illustration itself, so they can never intercept a
              tap meant for a nav link. */}
          <Illustration name="fern-1" className="absolute -top-10 -left-10 w-48 rotate-[-8deg] z-0" opacity={0.2} />
          <Illustration name="cherry-blossom" className="absolute top-16 -right-8 w-40 rotate-12 z-0" opacity={0.22} />
          <Illustration name="hydrangea" className="absolute bottom-24 -left-12 w-44 rotate-6 z-0" opacity={0.2} />
          <Illustration name="wildflower-spray" className="absolute -bottom-10 -right-10 w-48 -rotate-6 z-0" opacity={0.22} />

          {/* Was `position:fixed` nested inside the scrollable, flex-centered
              wrapper below — that's what made it unreliable ("close isn't
              working"): a fixed element inside an auto-scrolling flex
              container is a fragile combination across browsers. Now it's a
              plain `absolute` child of this already-viewport-pinned overlay
              (`fixed inset-0` above), which is the standard, unambiguous
              modal-close-button pattern. w-11 h-11 gives it a real 44px tap
              target instead of just the glyph's own tiny hit box. */}
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute top-3 right-4 z-20 flex items-center justify-center w-11 h-11 bg-transparent border-none text-2xl text-ink cursor-pointer"
          >
            &#10005;
          </button>

          <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6 overflow-y-auto py-16">
            {LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-[26px] text-ink no-underline"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-3 bg-terracotta cta-btn text-cream text-[13px] tracking-wider uppercase px-7 py-3.5 no-underline"
            >
              <CtaBloom seed="nav-mobile-enquire" />
              <span>Enquire</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
