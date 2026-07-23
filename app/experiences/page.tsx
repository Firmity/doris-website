import Placeholder from "@/components/Placeholder";
import Illustration from "@/components/Illustration";
import { EXPERIENCES } from "@/lib/experiences";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experiences Nearby",
  description:
    "What's around Doris Mountain Boutique Hotel — McLeod Ganj, Triund, Bhagsu Nag, Dharamkot, Norbulingka Institute, and more, all a short drive from Dharamshala.",
  path: "/experiences",
  image: "/assets/photos/optimized/viewing-1-alt.jpg",
});

export default function Experiences() {
  return (
    <>
      <section className="relative h-[64vh] min-h-[440px]">
        <Placeholder label="experiences hero photo" className="absolute inset-0" src="/assets/photos/optimized/viewing-1-alt.jpg" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50 flex flex-col items-start justify-end px-6 md:px-20 pb-12 pt-20">
          <div className="text-xs tracking-[0.16em] uppercase text-cream mb-3">Around Doris</div>
          <h1 className="font-serif text-4xl md:text-5xl text-cream">Experiences nearby</h1>
        </div>
      </section>

      <section className="relative overflow-hidden max-w-[1000px] mx-auto px-6 md:px-20 py-20">
        <Illustration name="lavender" className="absolute top-2 right-4 w-12 sm:w-20 md:w-24 lg:w-28 rotate-[10deg]" />
        <Illustration name="fern-1" className="absolute -bottom-6 -left-8 w-16 sm:w-24 md:w-32 lg:w-40 rotate-[-6deg]" />
        {EXPERIENCES.map(({ title, desc, photo }, i) => (
          <div
            key={title}
            className={`flex items-center gap-5 sm:gap-6 py-4 ${i < EXPERIENCES.length - 1 ? "border-b border-line" : ""}`}
          >
            <Placeholder
              label={title}
              className="w-20 h-16 sm:w-24 sm:h-[72px] shrink-0"
              src={`/assets/photos/optimized/experiences/${photo}.jpg`}
            />
            <div className="flex flex-wrap gap-x-6 gap-y-1 items-baseline flex-1 min-w-0">
              <div className="font-serif text-lg min-w-[200px]">{title}</div>
              <div className="text-sm text-muted flex-1">{desc}</div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
