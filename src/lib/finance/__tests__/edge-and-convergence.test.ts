import { describe, expect, it } from 'vitest'
import {
  annuityFV,
  annuityPV,
  effectiveAnnualRate,
  futureValue,
  growthSeries,
  paymentFromPV,
  presentValue,
} from '../index'
import type { Frequency } from '../types'

const annual: Frequency = { kind: 'periodic', m: 1 }
const monthly: Frequency = { kind: 'periodic', m: 12 }

describe('edge cases — zero rate', () => {
  it('FV/PV at 0% return the principal unchanged', () => {
    expect(futureValue(5000, 0, 30, monthly)).toBe(5000)
    expect(presentValue(5000, 0, 30, monthly)).toBe(5000)
  })

  it('annuities at i=0 are just payments × periods', () => {
    expect(annuityFV(100, 0, 12)).toBe(1200)
    expect(annuityPV(100, 0, 12)).toBe(1200)
    expect(paymentFromPV(1200, 0, 12)).toBe(100)
  })

  it('growth series at 0% has zero interest bands throughout', () => {
    const { points } = growthSeries({
      principal: 1000,
      annualRate: 0,
      years: 10,
      freq: annual,
    })
    for (const p of points) {
      expect(p.simpleInterest).toBe(0)
      expect(p.interestOnInterest).toBe(0)
      expect(p.balance).toBe(1000)
    }
  })
})

describe('growth series — band decomposition invariants', () => {
  it('bands always sum to the balance', () => {
    const { points } = growthSeries({
      principal: 2000,
      annualRate: 0.08,
      years: 30,
      freq: monthly,
      contribution: { amount: 200, timing: 'ordinary' },
    })
    for (const p of points) {
      expect(p.principalContributed + p.simpleInterest + p.interestOnInterest).toBeCloseTo(
        p.balance,
        6,
      )
    }
  })

  it('interest-on-interest is zero at t=0 and positive once compounding runs', () => {
    const { points, final } = growthSeries({
      principal: 1000,
      annualRate: 0.1,
      years: 40,
      freq: annual,
    })
    expect(points[0]!.interestOnInterest).toBe(0)
    expect(final.interestOnInterest).toBeGreaterThan(0)
  })

  it('lump-sum final balance matches the closed-form futureValue', () => {
    const { final } = growthSeries({
      principal: 1000,
      annualRate: 0.07,
      years: 25,
      freq: monthly,
    })
    expect(final.balance).toBeCloseTo(futureValue(1000, 0.07, 25, monthly), 4)
  })

  it('contribution path final balance matches annuityFV', () => {
    const monthlyRate = 0.06 / 12
    const months = 12 * 20
    const { final } = growthSeries({
      principal: 0,
      annualRate: 0.06,
      years: 20,
      freq: monthly,
      contribution: { amount: 300, timing: 'ordinary' },
    })
    const expected = annuityFV(300, monthlyRate, months, 'ordinary')
    expect(final.balance).toBeCloseTo(expected, 2)
  })
})

describe('convergence to continuous compounding (the Lecture 2 story)', () => {
  it('(1 + 1/m)^m climbs toward e as m grows', () => {
    const ms = [1, 2, 4, 12, 365, 8760]
    const values = ms.map((m) => Math.pow(1 + 1 / m, m))
    for (let k = 1; k < values.length; k++) {
      expect(values[k]!).toBeGreaterThan(values[k - 1]!)
    }
    expect(values[0]).toBeCloseTo(2.0, 6)
    expect(values[3]).toBeCloseTo(2.613035, 5)
    expect(values.at(-1)!).toBeCloseTo(Math.E, 3)
  })

  it('EAR at very high frequency approaches the continuous limit e^r − 1', () => {
    const r = 0.1
    const highFreq = effectiveAnnualRate(r, { kind: 'periodic', m: 1_000_000 })
    expect(highFreq).toBeCloseTo(Math.exp(r) - 1, 4)
  })
})
