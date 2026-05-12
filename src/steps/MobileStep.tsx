import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { PhoneInput } from "../components/ui/PhoneInput";
import { mobileSchema, type MobileInput } from "../flow/schema";
import type { FormData } from "../flow/types";

type Props = {
  defaultMobile?: string;
  defaultCountry?: string;
  onContinue: (patch: Partial<FormData>) => void;
  onBack: () => void;
};

export function MobileStep({
  defaultMobile,
  defaultCountry,
  onContinue,
  onBack,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MobileInput>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { mobile: defaultMobile ?? "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit((values) => {
    onContinue({ mobile: values.mobile });
  });

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex-1">
        {/* Card title — Figma 1:559: Rubik Medium 24/1.43, tracking -0.3556 */}
        <h2 className="text-[20px] font-medium leading-[1.43] tracking-[-0.3556px] text-[var(--color-ink-700)] sm:text-[22px] xl:text-[24px]">
          OTP Verification
        </h2>

        <div className="mt-[58px]">
          <label
            htmlFor="mobile"
            className="block text-[14px] font-normal leading-[16px] text-[var(--color-ink-muted)] opacity-80"
          >
            Mobile Number
            <span className="ml-[2px] text-[#ff7c52]">*</span>
          </label>
          <div className="mt-[7px]">
            <Controller
              control={control}
              name="mobile"
              render={({ field }) => (
                <PhoneInput
                  value={field.value}
                  onChange={(phone) => field.onChange(phone)}
                  defaultCountry={defaultCountry ?? "us"}
                  error={errors.mobile?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
