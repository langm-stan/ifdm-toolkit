# The Financial Decision-Making Toolkit

A platform of interactive, classroom-ready tools for teaching personal finance —
built in the spirit of Stanford's [Initiative for Financial Decision-Making](https://ifdm.stanford.edu/resourcehub)
and designed to be used, adapted, and embedded by instructors.

The first tool is a deep **Compound Interest** explorer. Time Value of Money and
Budgeting are designed to follow on the same foundation.

## Design principles

- **Every figure is provably correct.** A pure, unit-tested finance engine
  (`src/lib/finance`) underpins every tool and the AI explanations. Nothing is
  computed in a component.
- **It should not look generated.** An editorial, ink-on-warm-paper design
  system (`src/design-system`) with Source Serif 4 / IBM Plex, bespoke SVG
  charts, marginalia, and a restrained motion budget — built from design tokens,
  not framework defaults.
- **Distributable.** Each tool serializes its full state to the URL and supports
  an `?embed=1` mode for dropping into a course page or LMS.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # the finance engine + state round-trip suite
npm run build    # type-check + production build
```

## Structure

```
src/
  lib/finance/      Pure, tested math engine (FV/PV, EAR, annuities, amortization, growth bands)
  lib/format.ts     All currency / percent / tabular number formatting
  lib/ai/           Streaming hook for the AI "Explain" feature
  design-system/    Editorial primitives + bespoke SVG chart layer (tokens-driven)
  routes/
    LandingPage/    Platform masthead + tool index
    tools/CompoundInterest/   The flagship tool (Growth · Math · Frequency · Compare)
  styles/           Design tokens + base typography
supabase/functions/explain/   AI proxy (keeps the Anthropic key server-side)
```

## The AI "Explain" feature

Optional and built last so the toolkit runs fully without it. The explanation is
grounded: the model receives only figures the engine already computed and is
instructed to interpret, never recompute. Setup (a Supabase Edge Function under
your own account) is documented in [`supabase/README.md`](supabase/README.md).

## Tech

Vite · React · TypeScript · Vitest · KaTeX · d3-scale/d3-shape · CSS Modules.
No charting library and no UI framework — the look is intentionally bespoke.
