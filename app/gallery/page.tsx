import Placeholder from "@/components/Placeholder";
import GalleryPhoto from "@/components/GalleryPhoto";
import Illustration from "@/components/Illustration";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Doris, in pictures — the terrace, rooms, restaurant, and mountain views at Doris Mountain Boutique Hotel, Dharamshala, Himachal Pradesh.",
  path: "/gallery",
  image: "/assets/photos/optimized/balconyday-1.jpg",
});

export default function Gallery() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="gallery hero photo" className="absolute inset-0" src="/assets/photos/optimized/balconyday-1.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Gallery</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Doris, in pictures</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1400px] mx-auto px-6 md:px-20 py-20">
        <Illustration name="fern-2" className="absolute top-4 right-8 w-14 sm:w-20 lg:w-32 -rotate-6" />
        <Illustration name="wildflower-spray" className="absolute -bottom-6 -left-8 w-16 sm:w-24 lg:w-36 rotate-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GalleryPhoto alt="Terrace, daytime" className="h-[320px] col-span-2 row-span-2" src="/assets/photos/optimized/balconyday-1.jpg" />
          <GalleryPhoto alt="Terrace seating, daytime" className="h-[150px]" src="/assets/photos/optimized/balconyday-2.jpg" />
          <GalleryPhoto alt="Candlelit dining, evening" className="h-[150px]" src="/assets/photos/optimized/balconynight-1.jpg" />
          <GalleryPhoto alt="Terrace, evening" className="h-[150px]" src="/assets/photos/optimized/balconynight-2.jpg" />
          <GalleryPhoto alt="Restaurant interior" className="h-[280px]" src="/assets/photos/optimized/indoors-1.jpg" />
          <GalleryPhoto alt="Breakfast counter" className="h-[280px]" src="/assets/photos/optimized/indoors-2.jpg" />
          <GalleryPhoto alt="Kitchen at work" className="h-[280px] col-span-2" src="/assets/photos/optimized/kitchen.jpg" />
          <GalleryPhoto alt="Guest with vintage telescope" className="h-[280px]" src="/assets/photos/optimized/viewing-1.jpg" />
          <GalleryPhoto alt="Corridor with mountain view" className="h-[280px]" src="/assets/photos/optimized/hallway-view.jpg" />
          <GalleryPhoto alt="Entrance" className="h-[280px]" src="/assets/photos/optimized/entrance.jpg" />
        </div>
      </section>
    </>
  );
}
