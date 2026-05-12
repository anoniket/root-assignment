export type AccountType = "personal" | "business";

export type Step =
  | "account-type"
  | "mobile"
  | "otp"
  | "name"
  | "email"
  | "password"
  | "success";

export const STEP_ORDER: Step[] = [
  "account-type",
  "mobile",
  "otp",
  "name",
  "email",
  "password",
  "success",
];

export type FormData = {
  accountType?: AccountType;
  dialCode?: string;
  mobile?: string;
  otp?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export type PersistedState = {
  step: Step;
  data: FormData;
};
