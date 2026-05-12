import { z } from "zod";

export const accountTypeSchema = z.object({
  accountType: z.enum(["personal", "business"], {
    required_error: "Please choose an account type",
  }),
});

export type AccountTypeInput = z.infer<typeof accountTypeSchema>;

export const mobileSchema = z.object({
  /** Full E164 string from react-international-phone, e.g. "+12025550100". */
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Enter a valid mobile number"
    ),
});

export type MobileInput = z.infer<typeof mobileSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(4, "Enter the 4-digit code")
    .regex(/^\d{4}$/, "Numbers only"),
});

export type OtpInput = z.infer<typeof otpSchema>;

// Allow any-language letters plus common name punctuation (e.g. José, O'Hara).
const namePart = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(40, `${label} is too long`)
    .regex(
      /^\p{L}[\p{L}\s'-]*$/u,
      `${label} can only contain letters, spaces, hyphens, and apostrophes`
    );

export const nameSchema = z.object({
  firstName: namePart("First name"),
  lastName: namePart("Last name"),
});

export type NameInput = z.infer<typeof nameSchema>;

// Figma helper text says "Must be atleast 6 characters" — min length matches.
export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Must be at least 6 characters")
      .max(100, "Password is too long"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Both passwords must match",
  });

export type PasswordInput = z.infer<typeof passwordSchema>;
