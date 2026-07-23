"use client";
import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"pre" | "in" | "">("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setState("pre");
    let io: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setState("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      io.observe(el);
    });
    // Disconnect on unmount even if the element never intersected (e.g. a fast
    // route change scrolls past a Reveal before it enters the viewport) —
    // without this the observer keeps a reference to a detached DOM node.
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${state} ${className}`}>
      {children}
    </div>
  );
}
