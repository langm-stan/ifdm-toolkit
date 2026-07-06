# The Financial Decision-Making Toolkit

Interactive, classroom-ready tools for teaching personal finance — built in the
spirit of Stanford's [Initiative for Financial Decision-Making](https://ifdm.stanford.edu/resourcehub)
and designed for instructors to use, adapt, and embed.

Three tools, all built on one shared, unit-tested finance engine:

1. **Compound interest** — watch money grow, see how much of the result is
   interest earning interest, and read the formula with real numbers filled in.
2. **Time value of money** — guided loan and savings-goal scenarios, plus a
   **traditional five-key calculator** (N, I/Y, PV, PMT, FV) that solves for any
   value using the standard cash-flow sign convention.
3. **Budgeting & balance sheet** — an editable monthly budget and balance sheet,
   then a projection of what your leftover money could become if invested.

## Getting it up and running

You need [Node.js](https://nodejs.org) 18+ (includes `npm`).

```bash
git clone https://github.com/langm-stan/ifdm-toolkit.git
cd ifdm-toolkit
npm install        # install dependencies (first time only)
npm run dev        # start the dev server → http://localhost:5173
```

Open the printed URL in a browser. That's it — the whole app runs in the
browser with no backend or API keys.

Other commands:

```bash
npm test           # run the finance-engine unit tests (34 tests)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Features

- **Light / dark mode** and a **presentation size** toggle (100 / 125 / 150%) in
  the top bar — for projecting in a lecture.
- **Expandable charts** — hover any chart and click the expand icon for a
  full-screen view with the headline numbers.
- **Shareable scenarios** — the Compound Interest and TVM tools encode their
  full state in the URL, so you can link students to an exact example.
- **Embed mode** — add `?embed=1` to any tool's URL to strip the site chrome and
  drop a single tool into a course page or LMS via an iframe.

## Project structure

```
src/
  lib/finance/      Pure, unit-tested math engine (FV/PV, EAR, annuities,
                    amortization, growth-band decomposition, 5-key TVM solver)
  lib/format.ts     All currency / percent / tabular number formatting
  design-system/    Tokens-driven UI primitives + bespoke SVG chart layer
  routes/
    LandingPage/            Tool index
    tools/CompoundInterest/ Growth · Breakdown · Math · Experiment · Frequency
    tools/Tvm/              Borrow · Save · five-key Calculator
    tools/Budgeting/        Budget · Balance sheet · Goal projection
  styles/           Design tokens (light + dark) + base typography
```

## Deployment

The app is a static site (no server), so it can be hosted anywhere. Two easy
paths:

- **Vercel / Netlify** — import the repo, framework preset "Vite". A
  [`vercel.json`](vercel.json) is included so client-side routes resolve
  correctly. Works with private repos on the free tier.
- **GitHub Pages** — a workflow at
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
  publishes on every push to `main`. Enable it under **Settings → Pages →
  Source: GitHub Actions**. Note: GitHub Pages requires the repository to be
  **public** (or a paid plan for private Pages).

## Tech

Vite · React · TypeScript · React Router · Vitest · KaTeX · d3-scale / d3-shape ·
CSS Modules. No charting library and no UI framework — the interface is
intentionally bespoke.
