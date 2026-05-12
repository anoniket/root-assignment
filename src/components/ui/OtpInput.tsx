import {
  useEffect,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type Props = {
  /** Current value (string of up to `length` digits). */
  value: string;
  /** Fired with the new digit string. */
  onChange: (value: string) => void;
  /** Number of boxes. Defaults to 4. */
  length?: number;
  /** Validation error message. */
  error?: string;
  /** Focus the first box on mount. */
  autoFocus?: boolean;
};

/**
 * One-digit-per-box OTP input matching Figma node 1:882 (4 × 70×70 boxes,
 * 57px gaps, blue-tint border, centered digit).
 *
 * Behaviour:
 *  - typing a digit auto-advances focus
 *  - Backspace on an empty box jumps to the previous box and clears it
 *  - ←/→ arrows move focus
 *  - pasting a number string fills as many boxes as it has digits
 */
export function OtpInput({
  value,
  onChange,
  length = 4,
  error,
  autoFocus,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const writeDigit = (idx: number, digit: string) => {
    const next = digits.slice();
    next[idx] = digit;
    onChange(next.join(""));
  };

  const focus = (idx: number) => refs.current[idx]?.focus();

  const handleChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    writeDigit(idx, char);
    if (idx < length - 1) focus(idx + 1);
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        writeDigit(idx, "");
      } else if (idx > 0) {
        e.preventDefault();
        writeDigit(idx - 1, "");
        focus(idx - 1);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      focus(idx - 1);
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      focus(idx + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    focus(Math.min(text.length, length - 1));
  };

  useEffect(() => {
    if (autoFocus) focus(0);
  }, [autoFocus]);

  const borderClass = error
    ? "border-[var(--color-danger-500)]"
    : "border-[#729cf0]";

  return (
    <div>
      <div
        className="flex items-center gap-[57px]"
        role="group"
        aria-label={`Enter ${length}-digit code`}
      >
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            aria-label={`Digit ${idx + 1}`}
            aria-invalid={!!error}
            className={[
              "h-[70px] w-[70px] rounded-[12px] border border-solid bg-white",
              "text-center text-[16px] leading-[24px] text-[var(--color-ink-700)]",
              "outline-none transition-shadow",
              "focus-visible:shadow-[var(--shadow-focus)]",
              borderClass,
            ].join(" ")}
          />
        ))}
      </div>
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
}
