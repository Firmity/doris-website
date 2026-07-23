import Image from "next/image";

export default function Placeholder({
  label,
  className = "",
  src,
  priority = false,
}: {
  label: string;
  className?: string;
  /** Optional real photo. When omitted, falls back to the striped placeholder. */
  src?: string;
  /** Pass true for above-the-fold hero images to skip lazy-loading. */
  priority?: boolean;
}) {
  // Tailwind's compiled stylesheet order — not JSX string order — decides which
  // `position` utility wins when two are present. Hardcoding "relative" here would
  // silently beat a caller-supplied "absolute"/"fixed"/"sticky", breaking any
  // overlapping-image layout (e.g. the homepage story-photo overlap). Only default
  // to "relative" when the caller hasn't specified their own positioning.
  const hasPositioning = /\b(absolute|fixed|sticky)\b/.test(className);
  const base = `${hasPositioning ? "" : "relative"} overflow-hidden flex items-center justify-center ${className}`;

  if (src) {
    return (
      <div className={base}>
        <Image
          src={src}
          alt={label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={base}
      style={{
        background:
          "repeating-linear-gradient(45deg,#E4D2BE,#E4D2BE 12px,#EDE0CF 12px,#EDE0CF 24px)",
      }}
    >
      <span className="font-mono text-xs text-[#5C4A38] px-4 text-center">{label}</span>
    </div>
  );
}
