import { describe, expect, it } from 'vitest'
import { solveTvm, type TvmRegisters } from '../index'

function reg(partial: Partial<TvmRegisters>): TvmRegisters {
  return { n: 0, iy: 0, pv: 0, pmt: 0, fv: 0, py: 1, due: false, ...partial }
}

describe('five-key TVM solver', () => {
  it('solves PMT for a mortgage ($200k, 6%/yr monthly, 30y → −$1,199.10)', () => {
    const pmt = solveTvm(reg({ n: 360, iy: 6, py: 12, pv: 200_000, fv: 0 }), 'pmt')
    expect(pmt).toBeCloseTo(-1199.1, 2)
  })

  it('solves FV of a lump sum (−$1,000 at 5% for 10y → $1,628.89)', () => {
    const fv = solveTvm(reg({ n: 10, iy: 5, py: 1, pv: -1000, pmt: 0 }), 'fv')
    expect(fv).toBeCloseTo(1628.89, 2)
  })

  it('solves PV — the discounting shock ($100k in 50y at 8% → −$2,132.12)', () => {
    const pv = solveTvm(reg({ n: 50, iy: 8, py: 1, fv: 100_000, pmt: 0 }), 'pv')
    expect(pv).toBeCloseTo(-2132.12, 2)
  })

  it('solves N — years to double at 8% ≈ 9.0065', () => {
    const n = solveTvm(reg({ iy: 8, py: 1, pv: -1000, fv: 2000, pmt: 0 }), 'n')
    expect(n).toBeCloseTo(9.0065, 3)
  })

  it('solves I/Y — the rate that grows $1,000 to $1,628.89 in 10y is 5%', () => {
    const iy = solveTvm(reg({ n: 10, py: 1, pv: -1000, fv: 1628.89, pmt: 0 }), 'iy')
    expect(iy).toBeCloseTo(5, 3)
  })

  it('solves FV of an annuity ($100/mo at 12%/yr for 12 months, ordinary)', () => {
    const fv = solveTvm(reg({ n: 12, iy: 12, py: 12, pmt: -100, pv: 0 }), 'fv')
    expect(fv).toBeCloseTo(1268.25, 2)
  })

  it('respects begin/end mode (annuity due is one period richer)', () => {
    const end = solveTvm(reg({ n: 12, iy: 12, py: 12, pmt: -100, pv: 0, due: false }), 'fv')
    const begin = solveTvm(reg({ n: 12, iy: 12, py: 12, pmt: -100, pv: 0, due: true }), 'fv')
    expect(begin).toBeCloseTo(end * 1.01, 2)
  })

  it('handles a 0% rate (PMT = −(PV+FV)/N)', () => {
    const pmt = solveTvm(reg({ n: 10, iy: 0, py: 1, pv: 1000, fv: 0 }), 'pmt')
    expect(pmt).toBeCloseTo(-100, 6)
  })
})
