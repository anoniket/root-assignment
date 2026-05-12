import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { OtpInput } from "../components/ui/OtpInput";
import { generateOtp } from "../lib/otp";
import type { FormData } from "../flow/types";

const OTP_LENGTH = 4;
const RESEND_FEEDBACK_MS = 2500;

type Props = {
  onContinue: (patch: Partial<FormData>) => void;
  onBack: () => void;
};

export function OtpStep({ onContinue, onBack }: Props) {
  const [otp, setOtp] = useState(() => generateOtp(OTP_LENGTH));
  const [justResent, setJustResent] = useState(false);

  useEffect(() => {
    if (!justResent) return;
    const t = window.setTimeout(
      () => setJustResent(false),
      RESEND_FEEDBACK_MS
    );
    return () => window.clearTimeout(t);
  }, [justResent]);

  const handleResend = () => {
    setOtp(generateOtp(OTP_LENGTH));
    setJustResent(true);
  };

  const isValid = otp.length === OTP_LENGTH;

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValid) onContinue({ otp });
      }}
    >
      <div className="flex-1">
        <h2 className="text-[20px] font-medium leading-[1.43] tracking-[-0.3556px] text-[var(--color-ink-700)] sm:text-[22px] xl:text-[24px]">
          OTP Verification
        </h2>

        {/* 451px = total span of the four 70px boxes plus the three 57px gaps,
            so the resend link below can right-align to the last box. */}
        <div className="mt-[56px] xl:w-[451px]">
          <p className="text-[12px] font-normal leading-[16px] text-[var(--color-ink-muted)] opacity-80">
            An OTP has been sent to your mobile number
          </p>

          <div className="mt-[8px]">
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={OTP_LENGTH}
              autoFocus
            />
          </div>

          <div className="mt-[24px] flex justify-end text-[14px] leading-[16px]">
            {justResent ? (
              <span
                role="status"
                className="font-medium text-[var(--color-brand-600)]"
              >
                A fresh OTP has been sent
              </span>
            ) : (
              <>
                <span className="text-[var(--color-ink-700)]">
                  Did not receive OTP?
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  className="ml-1 font-medium text-[var(--color-brand-600)] opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100"
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="primary" disabled={!isValid}>
          Continue
        </Button>
      </div>
    </form>
  );
}
