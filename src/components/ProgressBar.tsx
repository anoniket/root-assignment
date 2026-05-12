import { motion } from "framer-motion";

type Props = {
  /** 0..1 fill ratio. */
  value: number;
};

/**
 * Continuous progress bar matching Figma node 1:556 "Slider":
 *  - 5px tall
 *  - 0.5px solid brand-600 border
 *  - 12px radius
 *  - blue fill that animates to `value * 100%` width
 *
 * Width is set by the caller (Figma: 554px on desktop).
 */
export function ProgressBar({ value }: Props) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={pct}
      className="relative h-[5px] w-full overflow-hidden rounded-[12px] border-[0.5px] border-solid border-[var(--color-brand-600)]"
    >
      <motion.div
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-y-0 left-0 rounded-[12px] bg-[var(--color-brand-600)]"
      />
    </div>
  );
}
