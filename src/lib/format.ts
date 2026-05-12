import { parsePhoneNumberFromString } from "libphonenumber-js";

/** Capitalize the first letter; leave the rest untouched. */
export function titleCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Format an E164 phone string ("+19711677290") for display ("+1 971 167 7290").
 * Returns the original string if parsing fails.
 */
export function formatPhone(e164: string | undefined): string {
  if (!e164) return "";
  const parsed = parsePhoneNumberFromString(e164);
  return parsed?.formatInternational() ?? e164;
}
