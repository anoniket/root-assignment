import { ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { formatPhone, titleCase } from "../lib/format";
import type { FormData } from "../flow/types";

/** Inline circle-check matching Figma's Font Awesome Light glyph (no extra deps). */
function CircleCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 46"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="23" cy="23" r="21.4" />
      <path d="M14.5 23.7l6.4 6.4L32 17.6" />
    </svg>
  );
}

type Props = {
  data: FormData;
  onDashboard: () => void;
  /** Force the modal closed (used while not on the success step). */
  open?: boolean;
};

export function SuccessStep({ data, onDashboard, open = true }: Props) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");

  const rows: Array<{ label: string; value: string }> = [
    { label: "Account Type", value: titleCase(data.accountType ?? "") },
    { label: "Name", value: fullName },
    { label: "Mobile Number", value: formatPhone(data.mobile) },
  ].filter((r) => r.value);

  // Inline style for the variable-axis Open Sans nodes (Tailwind has no
  // first-class fontVariationSettings utility).
  const openSansAxis = { fontVariationSettings: "'wdth' 100" } as const;

  return (
    <Modal open={open} ariaLabel="Account created successfully">
      <div className="flex w-[479px] max-w-[calc(100vw-32px)] flex-col items-center gap-8 rounded-[16px] bg-white px-6 py-[35px]">
        <div className="flex w-full max-w-[431px] flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <CircleCheck className="h-[46px] w-[46px] text-[#4b59d5]" />
            <div className="flex w-full max-w-[309px] flex-col items-center gap-2">
              <h2
                className="font-display text-[24px] font-semibold text-[#3f3e3f]"
                style={openSansAxis}
              >
                You&rsquo;re all set!
              </h2>
              <p
                className="font-display text-[14px] font-normal text-[#565656]"
                style={openSansAxis}
              >
                Here&rsquo;s a quick summary of your account details
              </p>
            </div>
          </div>

          <dl className="flex w-full flex-col items-start gap-4 whitespace-nowrap rounded-[24px] bg-[#f5f5f5] p-6 text-[14px]">
            {rows.map((r) => (
              <div
                key={r.label}
                className="flex w-full items-center justify-between"
              >
                <dt className="font-normal text-[#717680]">{r.label}</dt>
                <dd className="text-right font-medium text-[#181d27]">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center justify-center gap-1 whitespace-nowrap text-center">
            <ShieldCheck
              className="h-[14px] w-[14px] text-[#047647]"
              strokeWidth={2}
            />
            <p
              className="font-display text-[12px] font-normal text-[#565656]"
              style={openSansAxis}
            >
              Your account is secured with bank-grade security
            </p>
          </div>
        </div>

        <Button variant="primary" onClick={onDashboard}>
          Go To Dashboard
        </Button>
      </div>
    </Modal>
  );
}
