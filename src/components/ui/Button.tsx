import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  /** Default Figma width is 250px; set fullWidth to stretch in narrow containers. */
  fullWidth?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
};

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] " +
  "px-8 py-4 text-[14px] font-medium leading-none tracking-tight transition-all " +
  "duration-150 ease-out outline-none select-none " +
  "focus-visible:shadow-[var(--shadow-focus)] " +
  "active:scale-[0.985] disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-brand-600)] text-white shadow-sm " +
    "hover:bg-[var(--color-brand-700)] hover:shadow-md " +
    "disabled:bg-[var(--color-ink-300)] disabled:text-white " +
    "disabled:hover:shadow-sm disabled:active:scale-100",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-brand-600)] " +
    "border-2 border-[var(--color-line)] " +
    "hover:border-[var(--color-line-strong)] hover:bg-[var(--color-page)] " +
    "disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-[var(--color-surface)]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    loading = false,
    fullWidth = false,
    leading,
    trailing,
    children,
    className = "",
    disabled,
    type = "button",
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      data-loading={loading || undefined}
      className={[
        base,
        variants[variant],
        // Figma fixes the button at 250px on desktop. On mobile (<640px) fall
        // back to full width so stacked buttons fill the column. fullWidth
        // forces full at every breakpoint.
        fullWidth ? "w-full" : "w-full sm:w-[250px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        leading
      )}
      <span>{children}</span>
      {!loading && trailing}
    </button>
  );
});
