import Placeholder from "@/components/Placeholder";
import Illustration from "@/components/Illustration";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Story",
  description:
    "The story behind Doris Mountain Boutique Hotel in Shivnagar, Dharamshala — twenty-five rooms, a fourth-floor glass restaurant, and an open terrace facing the Dhauladhar range.",
  path: "/about",
  image: "/assets/photos/optimized/balconyday-2.jpg",
});

export default function About() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="about hero photo" className="absolute inset-0" src="/assets/photos/optimized/balconyday-2.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">About</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Our story</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[800px] mx-auto px-6 md:px-20 py-20">
        <Illustration name="fern-1" className="absolute top-4 right-2 w-14 sm:w-24 md:w-32 rotate-[8deg]" />
        <p className="relative z-10 text-base leading-loose text-[#3A332C] mb-6">
          Doris Mountain Boutique Hotel opened in Shivnagar, on the edge of Dharamshala, with a
          simple idea: give travellers coming for the Dhauladhar range a place to stay that takes
          the view as seriously as they do.
        </p>
        <p className="relative z-10 text-base leading-loose text-[#3A332C] mb-6">
          Twenty-five rooms across two categories, a glass-walled restaurant on the fourth floor,
          and an open terrace that doubles as an event space. The hotel is run by Hotel Royal
          Oasis, a short drive from McLeod Ganj, Dharamkot, and the Triund trailhead.
        </p>
        <p className="relative z-10 text-base leading-loose text-[#3A332C]">
          Our name is small on purpose — Doris is a house, not a hotel chain, and it's meant to
          feel that way from the moment you arrive.
        </p>
      </section>

      <section className="relative overflow-hidden max-w-[1200px] mx-auto px-6 md:px-20 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Illustration name="babys-breath" className="absolute bottom-6 right-2 w-12 sm:w-20 md:w-24 lg:w-28 -rotate-6" />
        <Placeholder label="photo" className="h-[340px]" src="/assets/photos/optimized/indoors-1.jpg" />
        <Placeholder label="photo" className="h-[340px]" src="/assets/photos/optimized/viewing-1.jpg" />
      </section>

    </>
  );
}
