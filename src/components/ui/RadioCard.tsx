import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon: ReactNode;
  /** Group name so cards behave as a radio group for keyboard / ARIA. */
  name: string;
};

/**
 * Selectable card matching the Figma spec:
 * - Default: white surface, 1px #d9e0e6 border, soft option shadow.
 * - Selected: brand blue border, label turns blue, navy circle with white check on the right.
 */
export function RadioCard({
  label,
  value,
  checked,
  onChange,
  icon,
  name,
}: Props) {
  return (
    <label
      className={[
        "group relative flex h-[76px] cursor-pointer items-center gap-6",
        // Figma asymmetric padding: 32px left (icon+label inset) / 24px right (checkbox inset)
        "rounded-[var(--radius-input)] bg-[var(--color-surface)] pl-8 pr-6",
        "shadow-[var(--shadow-option)] transition-all duration-200 ease-out",
        "border has-[input:focus-visible]:shadow-[var(--shadow-focus)]",
        "hover:-translate-y-px",
        checked
          ? "border-[var(--color-brand-600)]"
          : "border-[var(--color-line)] hover:border-[var(--color-line-strong)]",
      ].join(" ")}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
        aria-label={label}
      />

      <span
        aria-hidden
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center transition-colors",
          checked
            ? "text-[var(--color-brand-600)]"
            : "text-[var(--color-ink-700)]",
        ].join(" ")}
      >
        {icon}
      </span>

      <span
        className={[
          "flex-1 text-[16px] font-medium leading-none transition-colors",
          checked
            ? "text-[var(--color-brand-600)]"
            : "text-[var(--color-ink-700)]",
        ].join(" ")}
      >
        {label}
      </span>

      {/* Trailing check — only present in Figma's selected state.
          Wrapper stays mounted so the spring animation can run on transition,
          but is fully invisible when unchecked (Figma has no element here at rest). */}
      <span
        aria-hidden
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          checked
            ? "bg-[var(--color-brand-600)] text-white"
            : "bg-transparent text-transparent",
        ].join(" ")}
      >
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className="flex"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </motion.span>
      </span>
    </label>
  );
}
