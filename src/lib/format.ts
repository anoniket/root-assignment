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

/**
 * Mask the local part of an email for display in the success summary.
 * "john.doe@example.com" → "jo••••••@example.com" (matches Figma's bullet style).
 */
export function maskEmail(email: string | undefined): string {
  if (!email) return "";
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const visible = local.slice(0, Math.min(2, local.length));
  const dotsCount = Math.max(local.length - visible.length, 4);
  return `${visible}${"•".repeat(dotsCount)}${domain}`;
}
