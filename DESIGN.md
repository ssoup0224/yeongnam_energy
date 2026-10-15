# DESIGN.md — Yeongnam Energy Service redesign

The design system for the Pohang city-gas site. Tokens live in
`src/app/globals.css` under `@theme`; this file is the human-readable spec.
Keep them in sync.

## Brand

SK Group "Happy Wings" identity. Red is the brand spine; orange is the
gradient partner; ink is the neutral ramp. Official CI lockups (Korean /
English) are in `public/brand/` and swap by language.

| Role | Token | Hex |
|------|-------|-----|
| Primary (CTAs, active, alerts) | `sk-red-500` | `#EA002C` |
| Primary pressed | `sk-red-600` | `#D10028` |
| Accent / gradient end | `sk-orange-500` | `#FF7A00` |
| Page background | `ink-50` | `#F6F7F9` |
| Surface (cards) | `#FFFFFF` | — |
| Border | `ink-200` | `#DDE1E8` |
| Body text | `ink-900` | `#11151D` |
| Muted text | `ink-500` | `#6B7280` |

Signature gradient: `.sk-gradient` — `linear-gradient(100deg, red → orange)`.
Used on primary buttons, the active-nav underline, and data highlights
(e.g. the current month in the usage chart). `.sk-gradient-text` clips it to
text for the hero headline.

Each `sk-red` / `sk-orange` / `ink` ramp runs 50→900; use 50/100 for tints,
300–500 for marks, 600–900 for text and pressed states.

## Typography

- Family: **Pretendard Variable** (Korean + Latin), system fallback.
- Scale (rem): hero 2.75 / H1 2.25 / H2 1.5 / lead 1 / body 0.9375 / meta 0.8125 / fine 0.75.
- Weights: 800 (extrabold) for headings and emphasis, 700 for controls, 400 body.
- `word-break: keep-all` and `line-height: 1.6` for clean Korean wrapping.
- User text-size control scales the root via `--ui-scale` (100 / 112.5 / 125%).

## Spacing & layout

- Base unit **4px** (Tailwind default). Section rhythm: `py-9` mobile / `py-12–16` desktop.
- Page shell: `.shell` — `max-width: 1200px`, centered, 16px side gutter (24px ≥768px).
- Radii: cards `1.25rem`, controls `0.75rem`, pills full. Radius tokens `xl2`/`xl3`.
- Card shadow is restrained: a single soft drop only on hover/brand surfaces.

## Components

- **Buttons** — primary: `.sk-gradient` fill, white, `hover:brightness-95`.
  Secondary: `ink-900` solid. Ghost: `border-ink-200`. Min height 48px (`min-h-12`).
- **Cards** — white, `border-ink-200`, `rounded-[1.25rem]`; hover lifts `-translate-y-0.5`
  with a red-tinted shadow.
- **Inputs** — `border-2 border-ink-200`, focus `border-sk-red-500`, min height 52px.
- **Nav** — sticky header, desktop mega-menu on hover/focus, mobile drawer + bottom tab bar.

## States & accessibility

- Focus: one global ring — `outline: 3px solid sk-red-500; offset 2px` on all interactives.
- Touch targets ≥ 44px (controls use `min-h-10`–`min-h-14`).
- Color is never the only signal (icons + text on status, alerts, the usage chart).
- `prefers-reduced-motion` collapses animations to ~0ms.
- Every page has breadcrumbs, a skip link, and semantic landmarks.

## Internationalization

Korean is the default; a KO/EN toggle in the header flips strings at runtime
(stored in `localStorage`, applied pre-paint by a boot script to avoid flashes).
Render strings via `<T ko en />` (Server Components), `useT()(ko, en)` (attributes),
or `pick(biValue, lang)` (bilingual data in `src/lib/site.ts`). See `src/lib/i18n.tsx`.

## Do / don't

- **Do** lead with the brand red for the single primary action per view.
- **Do** keep surfaces white on an `ink-50` page; let the gradient be the accent, not the field.
- **Don't** stack multiple gradients or use red for large passive fills.
- **Don't** introduce new hex values — extend the ramps in `@theme` instead.
