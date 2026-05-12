import { forwardRef, useId, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Label text rendered above the input. */
  label: string;
  /** Validation error message to display under the input. */
  error?: string;
};

/**
 * Generic labeled text input matching Figma's "Input Field - Filled" component:
 *  - 76px tall, 12px radius, blue-tint border (#729cf0)
 *  - 18px label in muted gray, sitting 12px above the input
 *  - light placeholder (#d9e0e6) so empty state reads as a hint, not real text
 *
 * Width is controlled by the parent (default `w-full`); set
 * `className="xl:w-[516px]"` to lock to the desktop figma width.
 */
export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { label, error, className = "", id, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = !!error;

  return (
    <div className={className || "w-full"}>
      <label
        htmlFor={inputId}
        className="block text-[18px] font-normal leading-[16px] text-[#8292a1] opacity-80"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError}
        className={[
          "mt-[12px] h-[76px] w-full rounded-[12px] border border-solid bg-white",
          "px-6 text-[16px] leading-[24px] text-[var(--color-ink-700)] outline-none",
          "placeholder:text-[#d9e0e6]",
          "transition-shadow focus-visible:shadow-[var(--shadow-focus)]",
          hasError ? "border-[var(--color-danger-500)]" : "border-[#729cf0]",
        ].join(" ")}
        {...rest}
      />
      {error && (
        <p
          role="alert"
          className="mt-2 text-[13px] text-[var(--color-danger-500)]"
        >
          {error}
        </p>
      )}
    </div>
  );
});
