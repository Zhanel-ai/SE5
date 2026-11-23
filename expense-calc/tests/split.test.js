// Regression tests for risk R1 (even split loses cents / accepts invalid people counts).
import { describe, it, expect } from 'vitest'
import { splitEvenly } from '../src/expense.js'

const cents = (shares) => shares.reduce((s, x) => s + Math.round(x * 100), 0)

describe('splitEvenly keeps every cent', () => {
  it('10 between 3 people sums to exactly 10.00 and shares differ by at most 0.01', () => {
    const shares = splitEvenly(10, 3)
    expect(cents(shares)).toBe(1000)
    expect(Math.max(...shares) - Math.min(...shares)).toBeLessThanOrEqual(0.01 + 1e-9)
  })
  it('222.55 between 3 people sums to exactly 222.55', () => {
    expect(cents(splitEvenly(222.55, 3))).toBe(22255)
  })
  it('0.01 between 3 people gives one cent to one person', () => {
    expect(splitEvenly(0.01, 3).sort()).toEqual([0, 0, 0.01])
  })
  it('an even split is unchanged: 10 between 2 people', () => {
    expect(splitEvenly(10, 2)).toEqual([5, 5])
  })
})

describe('splitEvenly rejects invalid people counts', () => {
  for (const bad of [0, -2, NaN, 2.5, '3', undefined]) {
    it(`throws RangeError for ${String(bad)}`, () => {
      expect(() => splitEvenly(10, bad)).toThrow(RangeError)
    })
  }
})
