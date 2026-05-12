import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";

type Props = {
  /** E164-style phone string ("+12025550100") or empty. */
  value: string;
  /** Fired with full phone string + iso2 country code on every keystroke / country change. */
  onChange: (phone: string, iso2: string) => void;
  /** Default country iso2 when value is empty. */
  defaultCountry?: string;
  /** Validation error message to display under the input. */
  error?: string;
  /** Fallback placeholder used only when the active country has no format mask. */
  placeholderFallback?: string;
};

/**
 * Convert a country's format mask ('(...) ...-....') into a sample digits
 * placeholder ('(123) 456-7890') so the hint reflects the picked country.
 * The library types `format` as `string | FormatConfig | undefined`; we accept
 * both shapes and fall back to the prop string when no format is available.
 */
function buildPlaceholder(
  format: string | { default?: string } | undefined,
  fallback: string
): string {
  const mask =
    typeof format === "string" ? format : (format?.default ?? undefined);
  if (!mask) return fallback;
  let counter = 1;
  return mask.replace(/\./g, () => String(counter++ % 10));
}

/**
 * Two-box phone input matching Figma node 1:574:
 *  - Left  93×76: country selector (flag + dial code + chevron, opens dropdown)
 *  - Right 384×76: national phone number, formatted as user types
 *  - 26px gap, 1px solid var(--color-input-border) borders, 12px radius
 *
 * Uses `react-international-phone`'s usePhoneInput hook so we own the markup
 * but get country data + libphonenumber formatting for free.
 */
export function PhoneInput({
  value,
  onChange,
  defaultCountry = "us",
  error,
  placeholderFallback = "Enter mobile number",
}: Props) {
  const { inputValue, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput({
      defaultCountry,
      value,
      disableDialCodeAndPrefix: true,
      onChange: (d) => onChange(d.phone, d.country.iso2),
    });

  // Suppress validation error when the user has cleared the field — Continue
  // is already gated on `isValid`, so an error message here is just noise.
  const visibleError = inputValue ? error : undefined;

  const placeholder = useMemo(
    () => buildPlaceholder(country.format, placeholderFallback),
    [country.format, placeholderFallback]
  );

  const borderClass = visibleError
    ? "border-[var(--color-danger-500)]"
    : "border-[var(--color-input-border)]";

  return (
    <div>
      <div className="flex items-stretch gap-[26px]">
        <CountrySelect
          selectedIso={country.iso2}
          onSelect={(iso) => setCountry(iso)}
          borderClass={borderClass}
        />

        <input
          ref={inputRef}
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={placeholder}
          inputMode="tel"
          aria-invalid={!!visibleError}
          aria-label="Mobile number"
          className={[
            "h-[76px] w-[384px] rounded-[12px] border border-solid bg-white",
            "px-[24px] text-[16px] leading-[24px] text-[var(--color-ink-700)] outline-none",
            "placeholder:text-[var(--color-ink-muted)]",
            "transition-shadow focus-visible:shadow-[var(--shadow-focus)]",
            borderClass,
          ].join(" ")}
        />
      </div>

      {visibleError && (
        <p
          role="alert"
          className="mt-2 text-[13px] text-[var(--color-danger-500)]"
        >
          {visibleError}
        </p>
      )}
    </div>
  );
}

/** Country selector pill — 93×76 box matching the Figma left input. */
function CountrySelect({
  selectedIso,
  onSelect,
  borderClass,
}: {
  selectedIso: string;
  onSelect: (iso2: string) => void;
  borderClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const countries = useMemo(() => defaultCountries.map(parseCountry), []);
  const selected = countries.find((c) => c.iso2 === selectedIso);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q)
    );
  }, [countries, query]);

  // Close on outside click + ESC
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "flex h-[76px] w-[93px] items-center justify-center gap-1.5",
          "rounded-[12px] border border-solid bg-white",
          "outline-none transition-shadow focus-visible:shadow-[var(--shadow-focus)]",
          borderClass,
        ].join(" ")}
      >
        {selected && (
          <FlagImage
            iso2={selected.iso2}
            style={{ width: 18, height: 18 }}
          />
        )}
        <span className="text-[16px] leading-[24px] text-[var(--color-ink-700)] opacity-80">
          +{selected?.dialCode ?? ""}
        </span>
        <ChevronDown
          className={[
            "h-4 w-4 text-[var(--color-ink-500)] transition-transform",
            open && "rotate-180",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-20 flex w-[320px] flex-col overflow-hidden rounded-[12px] border border-[var(--color-line)] bg-white shadow-[var(--shadow-card)]"
        >
          <div className="border-b border-[var(--color-line)] p-2">
            <div className="flex items-center gap-2 rounded-md bg-[var(--color-page)] px-3 py-2">
              <Search className="h-4 w-4 text-[var(--color-ink-500)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                aria-label="Search countries"
                className="flex-1 bg-transparent text-sm text-[var(--color-ink-700)] outline-none placeholder:text-[var(--color-ink-400)]"
                autoFocus
              />
            </div>
          </div>
          <ul className="max-h-[260px] overflow-y-auto py-1">
            {filtered.map((c) => {
              const isActive = c.iso2 === selectedIso;
              return (
                <li key={c.iso2}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onSelect(c.iso2);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={[
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                      "hover:bg-[var(--color-page)]",
                      isActive && "bg-[var(--color-brand-50)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <FlagImage
                      iso2={c.iso2}
                      style={{ width: 20, height: 20 }}
                    />
                    <span className="flex-1 truncate text-sm text-[var(--color-ink-700)]">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-sm text-[var(--color-ink-500)]">
                      +{c.dialCode}
                    </span>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-[var(--color-ink-500)]">
                No matches
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
