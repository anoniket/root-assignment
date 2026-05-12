# Figma Signup Flow → React

A multi-step account-creation flow rebuilt from a Figma design as a production-grade React + TypeScript app.

> **Status:** All six Figma screens shipped + one extras screen (Email). Live on Vercel.

## Live demo

**[root-assignment-gold.vercel.app](https://root-assignment-gold.vercel.app/)** — deployed on Vercel.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite | Fast HMR, zero-config, ships ES modules |
| Language | TypeScript (strict) | Catches type errors at compile time |
| UI | React 18 | Industry standard |
| Styling | Tailwind CSS v4 (CSS-first config, design tokens via `@theme`) | Tokens defined once, utilities everywhere |
| Forms / validation | `react-hook-form` + `zod` | Schema-driven validation with minimal re-renders |
| Animation | `framer-motion` | Step transitions, modal in/out, animated check + progress fill |
| Phone input | `react-international-phone` (uses `libphonenumber-js`) | Real flag SVGs, format-as-you-type, all 200+ countries |
| Phone formatting (display) | `libphonenumber-js` | Pretty-printing the captured E.164 in the success summary |
| Icons | `lucide-react` + a hand-rolled inline SVG for the success check | Figma uses Font Awesome 6 Pro (paid); Lucide stands in for nav glyphs, the success check is inlined |
| Component library | None — primitives are hand-built | Full control over Figma fidelity |

## Architecture

A single-page state machine that's refresh-safe via `localStorage`. No router.

```
SignupFlow (state machine, decides which step to render)
  └─ Layout (page shell — header, illustration, floating card, progress slider)
       └─ <ActiveStep />     each step is its own component in src/steps/
            ├─ Form via react-hook-form + zod schema
            └─ Composes UI primitives from src/components/ui/

  + on the success step, a Modal overlay renders on top of the password screen
```

- The state machine moves linearly through `STEP_ORDER` (`flow/types.ts`); `goNext`, `goBack` and `reset` are the only mutators.
- All collected fields live in a single `formData` object so any step can read prior values.
- Both `currentStep` and `formData` are persisted to `localStorage` on every change. On mount, the app rehydrates and lands the user on whichever step they last left.
- `Layout` is a true shell — it knows nothing about the step content. Adding a new step means adding one file to `src/steps/`, listing it in `STEP_ORDER`, and rendering it in `SignupFlow`.
- The success modal is rendered as a fixed-position overlay over the password screen; the password screen stays mounted so its animation doesn't re-fire when the modal opens.

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
│   ├── storage.ts          # Typed localStorage helpers
│   ├── otp.ts              # generateOtp() — random 4-digit code, leading zeros allowed
│   └── format.ts           # titleCase + formatPhone (E.164 → international)
├── components/
│   ├── Layout.tsx          # Responsive shell (heading, illustration, card, slider)
│   ├── Illustration.tsx    # Bottom-left character PNG (extracted from Figma)
│   ├── ProgressBar.tsx     # Continuous slider (matches Figma node 1:556 / 1:894)
│   └── ui/
│       ├── Button.tsx      # primary | secondary, hover/focus/active/loading/disabled
│       ├── RadioCard.tsx   # Selectable card with icon + label + animated check
│       ├── TextInput.tsx   # Generic labeled input with optional hint + trailing slot
│       ├── PasswordInput.tsx # TextInput preset with eye-toggle reveal
│       ├── PhoneInput.tsx  # Country selector + format-as-you-type number field
│       ├── OtpInput.tsx    # n-digit code boxes (auto-advance, paste, ←/→)
│       └── Modal.tsx       # Fixed overlay + dimmed backdrop + ESC/click-out
└── steps/
    ├── AccountTypeStep.tsx # Screen 1 — Personal / Business
    ├── MobileStep.tsx      # Screen 2 — international phone entry
    ├── OtpStep.tsx         # Screen 3 — 4-digit code, prefilled, resend
    ├── NameStep.tsx        # Screen 4 — First + Last name
    ├── EmailStep.tsx       # Screen 4.5 — extras: email collection (not in Figma)
    ├── PasswordStep.tsx    # Screen 5 — password + confirm with reveal
    └── SuccessStep.tsx     # Screen 6 — success modal with summary
```

## Design fidelity

Every spacing, color, radius, shadow, and font value was pulled from Figma's design context (via the official Figma MCP server) — not eyeballed from screenshots. Each new screen was followed by an independent multi-agent audit comparing the implementation back to the Figma source; consensus drifts were fixed in dedicated commits.

Tokens live in `src/index.css` under the `@theme` block:

| Token | Value | Used for |
|---|---|---|
| `--font-sans` | `Rubik`, system fallbacks | Body default — every step screen |
| `--font-display` | `Open Sans`, then Rubik fallback | Success-modal title / subtitle / security text (Figma 1:2102 / 2103 / 2120) |
| `--color-brand-600` | `#0054fd` | Primary buttons, focus rings, selected state |
| `--color-ink-700`   | `#132c4a` | Body text |
| `--color-page`      | `#f6f7f9` | Page background |
| `--color-line`      | `#d9e0e6` | Default borders |
| `--radius-card`     | `16px`    | Cards, inputs |
| `--radius-pill`     | `38px`    | Buttons |
| `--shadow-card`     | `-16px 4px 35px 0 rgba(0,0,0,0.03)` | Floating card |
| `--shadow-option`   | `0 4px 8px 0 rgba(188,203,219,0.3)` | RadioCard / option surfaces |
| `--shadow-focus`    | `0 0 0 4px rgba(0,84,253,0.18)` | Focus rings on every interactive element |

A handful of one-off colors (`#4b59d5` for the success check, `#717680` / `#181d27` for the summary rows, `#3f3e3f` / `#565656` for the Open-Sans copy) come straight from Figma and are inlined where they're used — they aren't general-purpose tokens.

## Form validation rules

| Field | Rule |
|---|---|
| Account type | Required; preselected to `personal` |
| Mobile number | Required; valid E.164 string per `libphonenumber-js` (regex `^\+[1-9]\d{6,14}$`) |
| OTP | Required; exactly 4 digits |
| First / Last name | Required; trimmed; 1–40 chars; `^\p{L}[\p{L}\s'-]*$/u` (Unicode letters + space + hyphen + apostrophe — supports José, O'Hara, etc.) |
| Email | Required; trimmed; lowercased; valid email per Zod's `.email()`; ≤ 254 chars (extras screen — not in Figma) |
| Password | Required; ≥ 6 chars (per Figma helper text); ≤ 100 chars |
| Confirm password | Required; must equal password (Zod `.refine()`) |

Validation errors surface **only when the user has actually typed something** — empty inputs never display a "required" message since the Continue button is the gate. Implemented in `TextInput` (uncontrolled `onInput` listener) and `PhoneInput` (checks `inputValue` from `usePhoneInput`).

## Interaction states

Every interactive element supports the full state matrix:

- **Button** — default · hover (darker bg + lift) · focus-visible (4px brand ring) · active (scale `0.985`) · disabled (gray + cursor-not-allowed) · loading (spinner)
- **RadioCard** — default · hover (border darken + 1px lift) · focus-visible (ring on hidden input via `has-[input:focus-visible]`) · checked (blue border + blue label + animated check)
- **TextInput / PasswordInput** — default · focus-visible (brand ring) · invalid (red border + error text, only shown after typing) · password-reveal toggle is keyboard-accessible with `aria-pressed` + `aria-label`
- **PhoneInput** — default · focus-visible · invalid (red border + error text, only shown after typing) · searchable country dropdown (ESC + outside-click to close)
- **OtpInput** — type to advance · Backspace empties + jumps back · ←/→ to move focus · paste an entire code to fill all boxes · invalid state surfaces as red border + error text
- **Modal** — animated scale-in backdrop · body scroll-lock while open · ESC closes (when `onClose` is provided)

## Step transitions & motion

- Step-to-step: `framer-motion` `AnimatePresence` slides the active step out and the next one in (24px x-axis + opacity, 300ms ease).
- The slider gains 80px per step on the password screen it reaches the full 554px width — animated via Framer Motion (`motion.div` width).
- The success modal scales in (`opacity 0 → 1`, `scale 0.96 → 1`, `y 8 → 0`) with the backdrop fading to 70% opacity.
- Opening the success modal does **not** re-animate the password screen underneath: both steps share the same motion key, so AnimatePresence sees no transition.

## Persistence

- `useSignupState` hook saves `{ step, data }` to `localStorage` on every change.
- On mount it hydrates back from storage, so a refresh during the OTP step keeps you on the OTP step with your prior selections intact.
- `Go To Dashboard` on the success modal calls `reset()`, which clears storage and sends the user back to step 1 for a clean demo.

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
- [x] Button + RadioCard + PhoneInput + TextInput + PasswordInput + OtpInput + Modal primitives
- [x] Screen 1 — Account type (Personal / Business)
- [x] Screen 2 — Mobile number (country selector + format-as-you-type)
- [x] Screen 3 — OTP verification (random prefilled code, working resend)
- [x] Screen 4 — Name (First + Last with Unicode-aware validation)
- [x] Screen 5 — Password (≥6 chars + confirm + per-field reveal toggle)
- [x] Screen 6 — Success modal with captured-data summary
- [x] Deploy to Vercel — [root-assignment-gold.vercel.app](https://root-assignment-gold.vercel.app/)
- [x] **Extras**: Email step + masked email display in success summary
- [ ] Lighthouse pass (a11y / perf)

## Decisions worth calling out

- **No router.** Single-page state-machine navigation that survives refreshes via a custom `useSignupState` hook hydrated from `localStorage`. Avoids the React Router footprint and keeps the URL clean.
- **Custom UI primitives.** Hand-built Button / RadioCard / TextInput / PasswordInput / PhoneInput / OtpInput / Modal rather than pulling in a component library — full control over Figma fidelity and demonstrates component-design skill.
- **Hover/focus/active states are mine, not Figma.** Figma only shipped the default visual state for each component. The interactive states follow web-standard UX patterns.
- **Lucide + a hand-rolled SVG for the success check.** Figma uses Font Awesome 6 Pro for `user` / `suitcase` / chevron / `circle-check` / `shield-check`; FA Pro is paid. Lucide covers most glyphs; the success check is a small inline SVG (`<circle>` + `<path>`) so we don't ship a substitution that obviously doesn't match.
- **Per-step progress lookup, not a formula.** Figma's slider widths aren't strictly linear (mobile=80, otp=160, name=264, password=384, success=554). A `Record<Step, number>` in `SignupFlow` mirrors the spec exactly.
- **Generic TextInput grew slots, not variants.** A `hint` and a `trailing` slot let `TextInput` cover plain fields, password fields (via `PasswordInput`), and any future input that needs a right-side icon (search, clear, etc.) without divergent components.
- **Pixel-perfect on desktop, responsive below.** The Figma design is a single 1440×1024 desktop frame. The desktop layout reproduces every Figma coordinate exactly; below the `xl` breakpoint, content reflows into a stacked single-column shell.
- **Email step added as an extras screen.** The Figma flow doesn't collect an email but the success modal mock shows one. Rather than invent a value, an extras `EmailStep` was added between Name and Password (Zod email validation, lowercased + trimmed) so the summary row in the modal can be real captured data, masked for display (`jo••••••@example.com`).
