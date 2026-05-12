import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { TextInput } from "./TextInput";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> & {
  label: string;
  error?: string;
  hint?: string;
};

/** TextInput preset for passwords — adds an eye toggle to reveal/hide value. */
export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  function PasswordInput(props, ref) {
    const [reveal, setReveal] = useState(false);
    return (
      <TextInput
        ref={ref}
        type={reveal ? "text" : "password"}
        autoComplete="new-password"
        trailing={
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-brand-600)] outline-none transition-colors hover:bg-[var(--color-brand-50)] focus-visible:shadow-[var(--shadow-focus)]"
          >
            {reveal ? (
              <Eye className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <EyeOff className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);
