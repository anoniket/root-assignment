import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/Button";
import { TextInput } from "../components/ui/TextInput";
import { nameSchema, type NameInput } from "../flow/schema";
import type { FormData } from "../flow/types";

type Props = {
  defaultFirstName?: string;
  defaultLastName?: string;
  onContinue: (patch: Partial<FormData>) => void;
  onBack: () => void;
};

export function NameStep({
  defaultFirstName,
  defaultLastName,
  onContinue,
  onBack,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<NameInput>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      firstName: defaultFirstName ?? "",
      lastName: defaultLastName ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = handleSubmit((values) =>
    onContinue({ firstName: values.firstName, lastName: values.lastName })
  );

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex-1">
        <h2 className="text-[20px] font-medium leading-[1.43] tracking-[-0.3556px] text-[var(--color-ink-700)] sm:text-[22px] xl:text-[24px]">
          What is your name?
        </h2>

        <div className="mt-[56px] flex flex-col gap-4 xl:w-[516px]">
          <TextInput
            label="First Name"
            placeholder="Oliver"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
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
