# Figma Signup Flow → React

A multi-step account-creation flow rebuilt from a Figma design as a production-grade React + TypeScript app.

> **Status:** Foundations + Screen 1 (Account Type) + Screen 2 (Mobile Number) shipped. Screens 3–6 in progress.

## Live demo

_Deployed link will be added after the remaining screens land._

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite | Fast HMR, zero-config, ships ES modules |
| Language | TypeScript (strict) | Catches type errors at compile time |
| UI | React 18 | Industry standard |
| Styling | Tailwind CSS v4 (CSS-first config, design tokens via `@theme`) | Tokens defined once, utilities everywhere |
| Forms / validation | `react-hook-form` + `zod` | Schema-driven validation with minimal re-renders |
| Animation | `framer-motion` | Step transitions, progress bar fill, check-icon spring |
| Phone input | `react-international-phone` (uses libphonenumber-js) | Real flag SVGs, format-as-you-type, all 200+ countries |
| Icons | `lucide-react` | Tree-shakeable React icons (substituted for Font Awesome 6 Pro per Figma) |
| Component library | None — primitives are hand-built | Full control over Figma fidelity |

## Architecture

A single-page state machine that's refresh-safe via `localStorage`. No router.

```
SignupFlow (state machine, decides which step to render)
  └─ Layout (page shell — header, illustration, floating card, progress slider)
       └─ <ActiveStep />     each step is its own component in src/steps/
            ├─ Form via react-hook-form + zod schema
            └─ Composes UI primitives from src/components/ui/
```

- The state machine moves linearly through `STEP_ORDER` (`flow/types.ts`); `goNext` and `goBack` are the only mutators.
- All collected fields live in a single `formData` object so any step can read prior values.
- Both `currentStep` and `formData` are persisted to `localStorage` on every change. On mount, the app rehydrates and lands the user on whichever step they last left.
- `Layout` is a true shell — it knows nothing about the step content. Adding a new step means adding one file to `src/steps/`, listing it in `STEP_ORDER`, and rendering it in `SignupFlow`.

## Project structure

```
src/
├── main.tsx                # Entry
├── App.tsx                 # Mounts <SignupFlow />
├── index.css               # Tailwind v4 import + design tokens (@theme)
├── flow/
│   ├── SignupFlow.tsx      # State machine, AnimatePresence between steps
│   ├── useSignupState.ts   # currentStep + formData, persisted
│   ├── schema.ts           # Zod schema per step
│   └── types.ts            # Step, FormData, AccountType
├── lib/
│   └── storage.ts          # Typed localStorage helpers
├── components/
│   ├── Layout.tsx          # Responsive shell (heading, illustration, card)
│   ├── Illustration.tsx    # Inline SVG/PNG of the seated character
│   ├── ProgressBar.tsx     # Continuous slider matching Figma
│   └── ui/
│       ├── Button.tsx      # primary | secondary, with hover/focus/active/loading/disabled
│       ├── RadioCard.tsx   # Selectable card with icon + label + animated check
│       └── PhoneInput.tsx  # Country selector + format-as-you-type number field
└── steps/
    ├── AccountTypeStep.tsx # Screen 1 — Personal / Business
    └── MobileStep.tsx      # Screen 2 — international phone entry
```

## Design fidelity

Every spacing, color, radius, shadow, and font value was pulled from Figma's design context (via the official Figma MCP server) — not eyeballed from screenshots. Tokens live in `src/index.css` under the `@theme` block:

| Token | Value | Used for |
|---|---|---|
| `--color-brand-600` | `#0054fd` | Primary buttons, focus rings, selected state |
| `--color-ink-700`   | `#132c4a` | Body text |
| `--color-page`      | `#f6f7f9` | Page background |
| `--color-line`      | `#d9e0e6` | Default borders |
| `--radius-card`     | `16px`    | Cards, inputs |
| `--radius-pill`     | `38px`    | Buttons |
| `--shadow-card`     | `-16px 4px 35px 0 rgba(0,0,0,0.03)` | Floating card |

## Interaction states

Every interactive element supports the full state matrix:

- **Button** — default · hover (darker bg + lift) · focus-visible (4px brand ring) · active (scale `0.985`) · disabled (gray + cursor-not-allowed) · loading (spinner)
- **RadioCard** — default · hover (border darken + 1px lift) · focus-visible (ring on hidden input via `has-[input:focus-visible]`) · checked (blue border + blue label + animated check)
- **PhoneInput** — default · focus-visible · invalid (red border + error text, only shown after typing) · disabled-friendly via `aria-invalid`

Validation errors surface only when the user has actually typed something — empty inputs never display a "required" error since the Continue button is the gate.

## Getting started

```bash
git clone https://github.com/anoniket/root-assignment.git
cd root-assignment
npm install
npm run dev          # http://localhost:5173
npm run build        # production build to dist/
npm run lint
```

## Roadmap

- [x] Project scaffold + design tokens
- [x] State machine + persistence
- [x] Layout + progress slider + illustration
- [x] Button + RadioCard + PhoneInput primitives
- [x] Screen 1 — Account type (Personal / Business)
- [x] Screen 2 — Mobile number (country selector + format-as-you-type)
- [ ] Screen 3 — OTP verification (4-digit code + resend timer)
- [ ] Screen 4 — Name (first + last)
- [ ] Screen 5 — Password (strength meter + confirm)
- [ ] Screen 6 — Success modal
- [ ] Deploy to Vercel
- [ ] Lighthouse pass (a11y / perf)

## Decisions worth calling out

- **No router.** The user requested single-page state-machine navigation that survives refreshes. Achieved via a custom `useSignupState` hook that hydrates from `localStorage`. Avoids the React Router footprint and keeps the URL clean.
- **Custom UI primitives.** Hand-built Button / RadioCard / PhoneInput rather than pulling in a component library — gives full control over Figma fidelity and demonstrates component-design skill.
- **Hover/focus/active states are mine, not Figma.** Figma only shipped the default visual state for each component. The interactive states follow web-standard UX patterns.
- **Lucide icons substituted for Font Awesome 6 Pro.** Figma uses FA 6 Pro for the `user`, `suitcase`, and chevron glyphs; FA Pro is paid, so visually equivalent Lucide icons are used.
- **Pixel-perfect on desktop, responsive below.** The Figma design is a single 1440×1024 desktop frame. The desktop layout reproduces every Figma coordinate exactly; below the `xl` breakpoint, content reflows into a stacked single-column shell.
