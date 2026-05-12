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

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/\d/, "Must include a number"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export type PasswordInput = z.infer<typeof passwordSchema>;
