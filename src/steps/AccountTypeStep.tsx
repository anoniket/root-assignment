import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { RadioCard } from "../components/ui/RadioCard";
import { accountTypeSchema, type AccountTypeInput } from "../flow/schema";
import type { AccountType, FormData } from "../flow/types";

type Props = {
  defaultValue?: AccountType;
  onContinue: (patch: Partial<FormData>) => void;
  onBack: () => void;
  canGoBack: boolean;
};

export function AccountTypeStep({
  defaultValue,
  onContinue,
  onBack,
  canGoBack,
}: Props) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountTypeInput>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: { accountType: defaultValue ?? "personal" },
    mode: "onChange",
  });

  const selected = watch("accountType");

  const onSubmit = handleSubmit((values) => {
    onContinue({ accountType: values.accountType });
  });

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex-1">
        {/* Card title — Figma: Rubik 24/Regular with "what type of account" in Medium, w-453 */}
        <h2 className="text-[20px] font-normal leading-[1.43] tracking-[-0.3556px] text-[var(--color-ink-700)] sm:text-[22px] xl:w-[453px] xl:text-[24px]">
          To join us tell us{" "}
          <span className="font-medium">what type of account</span> you are
          opening
        </h2>

        {/* Figma: option cards are 516px wide with 16px gap (top:249 → top:341) */}
        <fieldset className="mt-10 space-y-4 xl:w-[516px]">
          <legend className="sr-only">Account type</legend>
          <RadioCard
            name="accountType"
            value="personal"
            label="Personal"
            checked={selected === "personal"}
            onChange={(v) =>
              setValue("accountType", v as AccountType, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            icon={<User className="h-4 w-4" strokeWidth={1.75} />}
          />
          <RadioCard
            name="accountType"
            value="business"
            label="Business"
            checked={selected === "business"}
            onChange={(v) =>
              setValue("accountType", v as AccountType, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            icon={<Briefcase className="h-4 w-4" strokeWidth={1.75} />}
          />

          {errors.accountType && (
            <p
              role="alert"
              className="mt-2 text-[13px] text-[var(--color-danger-500)]"
            >
              {errors.accountType.message}
            </p>
          )}
        </fieldset>
      </div>

      {/* Button row — Figma: Back at card-left+96, Continue at card-right-96, 16px gap.
          Card has px-[64px], so the row needs +32px on each side via mx-8. */}
      <div className="mt-10 flex flex-col gap-3 sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={!canGoBack}
        >
          Back
        </Button>
        <Button type="submit" variant="primary" disabled={!selected}>
          Continue
        </Button>
      </div>
    </form>
  );
}
