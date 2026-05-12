import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "../components/Layout";
import { AccountTypeStep } from "../steps/AccountTypeStep";
import { MobileStep } from "../steps/MobileStep";
import { NameStep } from "../steps/NameStep";
import { OtpStep } from "../steps/OtpStep";
import { PasswordStep } from "../steps/PasswordStep";
import type { Step } from "./types";
import { useSignupState } from "./useSignupState";

// Figma slider widths per step (1:556, 1:894, 1:1242, ...). Per-step values
// rather than a formula because the design isn't strictly linear (264 ≠ 240).
const SLIDER_WIDTH = 554;
const PROGRESS_PX: Record<Step, number> = {
  "account-type": 0,
  mobile: 80,
  otp: 160,
  name: 264,
  password: 384,
  success: 554,
};

const stepTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

export function SignupFlow() {
  const { step, data, stepIndex, goNext, goBack } = useSignupState();

  // Screen 1 (account-type) has NO progress bar — Figma shows it from screen 2 onward.
  const progress = PROGRESS_PX[step] / SLIDER_WIDTH;
  const canGoBack = stepIndex > 0;

  return (
    <Layout progress={progress}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          {...stepTransition}
          className="flex h-full flex-col"
        >
          {step === "account-type" && (
            <AccountTypeStep
              defaultValue={data.accountType}
              onContinue={goNext}
              onBack={goBack}
              canGoBack={canGoBack}
            />
          )}

          {step === "mobile" && (
            <MobileStep
              defaultMobile={data.mobile}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {step === "otp" && (
            <OtpStep onContinue={goNext} onBack={goBack} />
          )}

          {step === "name" && (
            <NameStep
              defaultFirstName={data.firstName}
              defaultLastName={data.lastName}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {step === "password" && (
            <PasswordStep onContinue={goNext} onBack={goBack} />
          )}

          {step === "success" && (
            <ComingSoon stepName={step} onBack={goBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function ComingSoon({
  stepName,
  onBack,
}: {
  stepName: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-400)]">
        Step
      </p>
      <h2 className="text-2xl font-bold text-[var(--color-ink-900)]">
        {stepName}
      </h2>
      <p className="max-w-sm text-sm text-[var(--color-ink-500)]">
        This screen is coming next. Your progress is saved — refresh the page
        and you&apos;ll land right back here.
      </p>
      <button
        onClick={onBack}
        className="mt-2 text-sm font-semibold text-[var(--color-brand-600)] hover:text-[var(--color-brand-700)]"
      >
        ← Go back
      </button>
    </div>
  );
}
