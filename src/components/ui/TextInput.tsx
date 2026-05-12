import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  /** Label text rendered above the input. */
  label: string;
  /** Validation error message to display under the input. */
  error?: string;
  /** Always-visible helper text shown below the input when no error is active. */
  hint?: string;
  /** Optional trailing slot (e.g. password eye toggle, clear button). */
  trailing?: ReactNode;
};

/**
 * Generic labeled text input matching Figma's "Input Field - Filled" component:
 *  - 76px tall, 12px radius, blue-tint border (var(--color-input-border))
 *  - 18px label in muted gray, sitting 12px above the input
 *  - light placeholder (var(--color-line)) so empty state reads as a hint, not real text
 *
 * Width is controlled by the parent (default `w-full`); set
 * `className="xl:w-[516px]"` to lock to the desktop figma width.
 *
 * Validation errors are suppressed while the input is empty — Continue is
 * already gated on `isValid`, so a "required" message in an empty field is
 * just noise.
 */
export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
  { label, error, hint, trailing, className = "", id, defaultValue, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const [hasContent, setHasContent] = useState(
    () => !!String(defaultValue ?? "").trim()
  );
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    setHasContent(!!e.currentTarget.value.trim());
  };

  const visibleError = hasContent ? error : undefined;
  const hasError = !!visibleError;

  return (
    <div className={className || "w-full"}>
      <label
        htmlFor={inputId}
        className="block text-[18px] font-normal leading-[16px] text-[var(--color-ink-muted)] opacity-80"
      >
        {label}
      </label>
      <div className="relative mt-[12px]">
        <input
          ref={ref}
          id={inputId}
          defaultValue={defaultValue}
          onInput={handleInput}
          aria-invalid={hasError}
          className={[
            "h-[76px] w-full rounded-[12px] border border-solid bg-white",
            "px-6 text-[16px] leading-[24px] text-[var(--color-ink-700)] outline-none",
            "placeholder:text-[var(--color-line)]",
            "transition-shadow focus-visible:shadow-[var(--shadow-focus)]",
            // Reserve room for the trailing icon so text never overlaps it.
            trailing ? "pr-[56px]" : "",
            hasError
              ? "border-[var(--color-danger-500)]"
              : "border-[var(--color-input-border)]",
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />
        {trailing && (
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center [&_*]:pointer-events-auto">
            {trailing}
          </div>
        )}
      </div>
      {visibleError ? (
        <p
          role="alert"
          className="mt-2 text-[13px] text-[var(--color-danger-500)]"
        >
          {visibleError}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[14px] leading-[16px] text-[var(--color-ink-muted)] opacity-80">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
