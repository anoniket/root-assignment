import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { PasswordInput } from "../components/ui/PasswordInput";
import { passwordSchema, type PasswordInput as PasswordInputData } from "../flow/schema";
import type { FormData } from "../flow/types";

type Props = {
  defaultPassword?: string;
  onContinue: (patch: Partial<FormData>) => void;
  onBack: () => void;
};

export function PasswordStep({ defaultPassword, onContinue, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordInputData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: defaultPassword ?? "",
      confirm: defaultPassword ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit((values) => onContinue({ password: values.password }));

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex-1">
        <h2 className="text-[20px] font-medium leading-[1.43] tracking-[-0.3556px] text-[var(--color-ink-700)] sm:text-[22px] xl:text-[24px]">
          Create Password for your account
        </h2>

        <div className="mt-[56px] flex flex-col gap-6 xl:w-[516px]">
          <PasswordInput
            label="Enter new password"
            placeholder="Enter new password"
            hint="Must be at least 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm password"
            hint="Both passwords must match"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
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
