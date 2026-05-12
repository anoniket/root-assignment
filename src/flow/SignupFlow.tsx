import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "../components/Layout";
import { AccountTypeStep } from "../steps/AccountTypeStep";
import { MobileStep } from "../steps/MobileStep";
import { NameStep } from "../steps/NameStep";
import { OtpStep } from "../steps/OtpStep";
import { PasswordStep } from "../steps/PasswordStep";
import { SuccessStep } from "../steps/SuccessStep";
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
  const { step, data, stepIndex, goNext, goBack, reset } = useSignupState();

  // Screen 1 (account-type) has NO progress bar — Figma shows it from screen 2 onward.
  const progress = PROGRESS_PX[step] / SLIDER_WIDTH;
  const canGoBack = stepIndex > 0;

  return (
    <Layout progress={progress}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          // Use the same key for password + success so opening the success modal
          // doesn't re-animate the password screen underneath.
          key={step === "success" ? "password" : step}
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

          {(step === "password" || step === "success") && (
            <PasswordStep
              defaultPassword={data.password}
              onContinue={goNext}
              onBack={goBack}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Success modal overlays the entire viewport when the flow is complete */}
      <SuccessStep
        data={data}
        onDashboard={reset}
        open={step === "success"}
      />
    </Layout>
  );
}

