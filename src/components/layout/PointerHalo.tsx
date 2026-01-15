import { useEffect, useRef } from "react";

/**
 * Signature moment: halo que segue o ponteiro no herói.
 * Respeita prefers-reduced-motion (não faz nada quando reduzido).
 */
export function PointerHalo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const handler = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x.toFixed(2)}%`);
      el.style.setProperty("--my", `${y.toFixed(2)}%`);
    };

    el.addEventListener("pointermove", handler);
    return () => el.removeEventListener("pointermove", handler);
  }, []);

  return <div ref={ref} className={className} />;
}
