import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import BackgroundMusic from "@/components/BackgroundMusic";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-lora" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dorismountainhotel.com"),
  title: {
    default: "Doris Mountain Boutique Hotel — Dharamshala, Himachal Pradesh",
    template: "%s | Doris Mountain Boutique Hotel",
  },
  description: "A mountain home above the Kangra valley, Dharamshala, Himachal Pradesh.",
};

// LodgingBusiness structured data — renders on every page so search engines
// have one canonical, consistent description of the property (name, address,
// contact, amenities) regardless of which page they crawl first. This is
// what feeds Google's hotel rich-result / knowledge-panel treatment.
// NOTE: metadataBase above and the `url` here use a placeholder domain
// (dorismountainhotel.com) since no real domain was provided — swap both to
// the actual production domain once one exists, otherwise canonical links
// and OG images will point at a domain nobody owns.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Doris Mountain Boutique Hotel",
  image: "https://www.dorismountainhotel.com/assets/photos/optimized/deluxe.jpg",
  url: "https://www.dorismountainhotel.com",
  telephone: ["+91-93173-71655", "+91-99144-72730"],
  email: "dorismbhotel@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vill. Shivnagar, Post Office Garoh, Opp. Rana Himalayan Tyres",
    addressLocality: "Dharamshala",
    addressRegion: "Himachal Pradesh",
    postalCode: "176217",
    addressCountry: "IN",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Banquet Hall", value: true },
    { "@type": "LocationFeatureSpecification", name: "Terrace", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Car Parking", value: true },
  ],
  parentOrganization: { "@type": "Organization", name: "Hotel Royal Oasis" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lora.variable}>
      <body className="bg-cream text-ink font-sans">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          Nav and Footer live here, outside PageTransition, on purpose:
          PageTransition's wrapper div runs a `transform`-based CSS keyframe
          animation on every route change. Per the CSS spec, any ancestor with
          a non-`none` transform becomes the containing block for `position:
          fixed` descendants — so a fixed Nav rendered *inside* that wrapper
          intermittently loses its viewport-pinned behavior around every
          navigation. Keeping Nav (and Footer, so it doesn't replay a fade-in
          on every click either) outside the animated subtree means `fixed`
          always resolves against the real viewport, permanently. Same
          reasoning applies to BackgroundMusic: inside PageTransition, the
          <audio> element would unmount/remount on every route change and the
          track would restart from 0:00 on every single click.
        */}
        <Nav />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <CustomCursor />
        <BackgroundMusic />
      </body>
    </html>
  );
}
