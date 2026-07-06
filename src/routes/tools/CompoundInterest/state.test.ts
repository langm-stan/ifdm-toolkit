import { describe, expect, it } from 'vitest'
import { DEFAULT_SCENARIO, parseScenario, toSearchParams, type Scenario } from './state'

describe('scenario URL round-trip', () => {
  const cases: Scenario[] = [
    DEFAULT_SCENARIO,
    { principal: 100_000, ratePct: 8, years: 50, frequency: 'annual', mode: 'pv', contribution: null },
    {
      principal: 0,
      ratePct: 7,
      years: 40,
      frequency: 'monthly',
      mode: 'fv',
      contribution: { amount: 150, timing: 'due' },
    },
    { principal: 10_000, ratePct: 10, years: 30, frequency: 'continuous', mode: 'fv', contribution: null },
  ]

  it.each(cases)('survives serialize → parse', (scenario) => {
    const round = parseScenario(toSearchParams(scenario))
    expect(round).toEqual(scenario)
  })

  it('falls back to defaults on empty params', () => {
    expect(parseScenario(new URLSearchParams())).toEqual(DEFAULT_SCENARIO)
  })
})
