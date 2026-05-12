/** Generate a fresh 4-digit OTP, allowing leading zeros (e.g. "0392"). */
export function generateOtp(length = 4): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}
