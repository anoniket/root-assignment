import type { ReactNode } from "react";
import { Illustration } from "./Illustration";
import { ProgressBar } from "./ProgressBar";

type Props = {
  children: ReactNode;
  /** Progress bar fill ratio 0..1 (0 hides the bar entirely). */
  progress: number;
};

/**
 * Page-wide shell: single rounded surface (Figma's frame) with the topographic
 * pattern as a faint background, the heading + illustration on the left, and a
 * floating white card on the right that hosts the active step.
 *
 * Match the Figma desktop layout (1440×1024) at ≥1100px and gracefully collapse
 * down to mobile.
 */
export function Layout({ children, progress }: Props) {
  const showProgress = progress > 0;
  return (
    <div className="relative min-h-full w-full overflow-hidden bg-[var(--color-page)]">
      {/* Topographic pattern — faint, full-bleed, behind everything.
          Figma 1:90: inset-[0.2% 0 0 0], opacity 0.15 */}
      <img
        src="/bg-topo.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[0.2%] h-full w-full select-none opacity-[0.15]"
        draggable={false}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col xl:block">
        {/* === Desktop layout (≥1100px) — pixel-positioned to mirror Figma === */}
        <div className="hidden min-h-screen xl:block">
          {/* Heading block — Figma 1:154: left=80, top=93, whitespace-nowrap */}
          <header className="absolute left-[80px] top-[93px] whitespace-nowrap">
            <p className="text-[24px] font-light leading-[32px] text-[var(--color-ink-700)]">
              Let&rsquo;s get started
            </p>
            <h1 className="mt-4 text-[48px] font-bold leading-[54px] text-[var(--color-ink-700)]">
              Create your account
            </h1>
            <p className="mt-6 text-[16px] font-normal text-[var(--color-ink-700)]">
              Follow the steps to create your account
            </p>
          </header>

          {/* Illustration — Figma: left=80, bottom=80, w=600, h=384 */}
          <div className="pointer-events-none absolute bottom-[80px] left-[80px] w-[600px]">
            <Illustration className="block h-auto w-full" />
          </div>

          {/* Floating card — Figma anchors: left=calc(41.67% + 84px), top=81, bottom=48
              (Figma's 1024-tall frame had height 895; we pin bottom instead so the card
              fills naturally on viewports taller than 1024.) */}
          <section
            className="absolute w-[708px] rounded-[var(--radius-card)] bg-[var(--color-surface)] px-[64px] py-[44px] shadow-[var(--shadow-card)]"
            style={{
              left: "calc(41.67% + 84px)",
              top: "81px",
              bottom: "48px",
            }}
          >
            {/* Slider — Figma 1:556 sits 9px above card top, 554px wide, anchored to card-left+1px */}
            {showProgress && (
              <div className="absolute left-[64px] top-[-2px] w-[554px]">
                <ProgressBar value={progress} />
              </div>
            )}
            <div className="flex h-full min-h-[460px] flex-col">{children}</div>
          </section>
        </div>

        {/* === Tablet / mobile layout (<1280px) — stacked, centered, max-w-[640px] === */}
        <div className="flex min-h-screen flex-col items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 xl:hidden">
          <header className="w-full max-w-[640px] space-y-3">
            <p className="text-[18px] font-light leading-[24px] text-[var(--color-ink-700)] sm:text-[22px]">
              Let&rsquo;s get started
            </p>
            <h1 className="text-[34px] font-bold leading-[1.05] text-[var(--color-ink-700)] sm:text-[42px]">
              Create your account
            </h1>
            <p className="text-[14px] text-[var(--color-ink-700)] sm:text-[16px]">
              Follow the steps to create your account
            </p>
          </header>

          <section className="relative flex w-full max-w-[640px] flex-1 flex-col rounded-[var(--radius-card)] bg-[var(--color-surface)] px-5 py-6 shadow-[var(--shadow-card)] sm:px-8 sm:py-8">
            {showProgress && (
              <div className="mb-6 w-full">
                <ProgressBar value={progress} />
              </div>
            )}
            <div className="flex h-full min-h-[460px] flex-col">{children}</div>
          </section>

          <div className="hidden w-full max-w-[640px] justify-center sm:flex">
            <Illustration className="block h-auto w-full max-w-[420px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

