import { describe, expect, it } from 'vitest'
import {
  annuityFV,
  annuityPV,
  amortizationSchedule,
  effectiveAnnualRate,
  futureValue,
  nominalRateFromEAR,
  paymentFromPV,
  presentValue,
  yearsToReach,
} from '../index'
import type { Frequency } from '../types'

const annual: Frequency = { kind: 'periodic', m: 1 }
const monthly: Frequency = { kind: 'periodic', m: 12 }
const continuous: Frequency = { kind: 'continuous' }

describe('canonical textbook values', () => {
  it('PV — the headline classroom example ($100k in 50y at 8% ≈ $2,132.12 today)', () => {
    expect(presentValue(100_000, 0.08, 50, annual)).toBeCloseTo(2132.12, 2)
  })

  it('FV — $1,000 at 5% for 10 years, annual', () => {
    expect(futureValue(1000, 0.05, 10, annual)).toBeCloseTo(1628.89, 2)
  })

  it('FV — $1,000 at 12% for 10 years, monthly', () => {
    expect(futureValue(1000, 0.12, 10, monthly)).toBeCloseTo(3300.39, 2)
  })

  it('FV — $1,000 at 8% for 10 years, continuous', () => {
    expect(futureValue(1000, 0.08, 10, continuous)).toBeCloseTo(2225.54, 2)
  })

  it('EAR — 12% nominal compounded monthly = 12.6825%', () => {
    expect(effectiveAnnualRate(0.12, monthly)).toBeCloseTo(0.126825, 6)
  })

  it('EAR — 12% nominal compounded continuously = e^0.12 − 1', () => {
    expect(effectiveAnnualRate(0.12, continuous)).toBeCloseTo(Math.exp(0.12) - 1, 9)
    expect(effectiveAnnualRate(0.12, continuous)).toBeCloseTo(0.127497, 6)
  })

  it('annuity FV — $100/period at 1% for 12 periods (ordinary & due)', () => {
    expect(annuityFV(100, 0.01, 12, 'ordinary')).toBeCloseTo(1268.25, 2)
    expect(annuityFV(100, 0.01, 12, 'due')).toBeCloseTo(1268.25 * 1.01, 2)
  })

  it('annuity PV — $100/period at 1% for 12 periods (ordinary)', () => {
    expect(annuityPV(100, 0.01, 12, 'ordinary')).toBeCloseTo(1125.51, 2)
  })

  it('mortgage payment — $200k at 0.5%/mo for 360 months = $1,199.10', () => {
    expect(paymentFromPV(200_000, 0.005, 360)).toBeCloseTo(1199.10, 2)
  })

  it('amortization — $200k at 0.5%/mo for 360 months', () => {
    const sched = amortizationSchedule(200_000, 0.005, 360)
    expect(sched.payment).toBeCloseTo(1199.10, 2)
    expect(sched.totalInterest).toBeCloseTo(231_676.38, 1)
    expect(sched.rows[0]!.interest).toBeCloseTo(1000.0, 2)
    expect(sched.rows[0]!.principal).toBeCloseTo(199.1, 2)
    expect(sched.rows.at(-1)!.balanceEnd).toBe(0)
    expect(sched.rows).toHaveLength(360)
  })

  it('years to double at 8% annual ≈ 9.0065 (Rule of 72 ≈ 9)', () => {
    expect(yearsToReach(1, 2, 0.08, annual)).toBeCloseTo(9.0065, 3)
  })

  it('nominalRateFromEAR inverts effectiveAnnualRate', () => {
    const ear = effectiveAnnualRate(0.09, monthly)
    expect(nominalRateFromEAR(ear, monthly)).toBeCloseTo(0.09, 9)
  })
})
