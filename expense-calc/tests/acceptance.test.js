// Acceptance tests AC1–AC5 from AGENTS.md (characterization tests: they describe the
// behaviour that must stay true before and after every change).
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { total, categoryTotals, budgetStatus, splitEvenly } from '../src/expense.js'

const sample = JSON.parse(readFileSync(new URL('../data/sample.json', import.meta.url), 'utf8'))
const deepFreeze = (o) => { Object.values(o).forEach((v) => typeof v === 'object' && v && deepFreeze(v)); return Object.freeze(o) }
const round2 = (n) => Math.round(n * 100) / 100

describe('AC1 – total', () => {
  it('sums amounts rounded to 2 decimals', () => {
    expect(total(sample)).toBe(222.55)
    expect(total([{ category: 'food', amount: 0.1 }, { category: 'food', amount: 0.2 }])).toBe(0.3)
  })
  it('is 0 for an empty list', () => {
    expect(total([])).toBe(0)
  })
})

describe('AC2 – category totals add up to the total', () => {
  it('holds for the sample data', () => {
    const sum = Object.values(categoryTotals(sample)).reduce((a, b) => a + b, 0)
    expect(round2(sum)).toBe(total(sample))
  })
  it('holds for 0.1 + 0.2 in one category', () => {
    const list = [{ category: 'food', amount: 0.1 }, { category: 'food', amount: 0.2 }]
    const sum = Object.values(categoryTotals(list)).reduce((a, b) => a + b, 0)
    expect(round2(sum)).toBe(total(list))
  })
})

describe('AC3 – budget status at each limit', () => {
  const limits = { food: 300, transport: 120, fun: 80, office: 200, other: 200 }
  for (const [category, limit] of Object.entries(limits)) {
    it(`${category}: ok at ${limit}, over at ${limit + 0.01}`, () => {
      expect(budgetStatus(category, limit)).toBe('ok')
      expect(budgetStatus(category, limit + 0.01)).toBe('over')
    })
  }
})

describe('AC3 – unusual category names use the default limit', () => {
  it('constructor / toString / __proto__ are treated as unknown categories', () => {
    for (const c of ['constructor', 'toString', '__proto__']) {
      expect(budgetStatus(c, 200)).toBe('ok')
      expect(budgetStatus(c, 200.01)).toBe('over')
    }
  })
})

describe('AC4 – no mutation of the input', () => {
  it('total, categoryTotals, budgetStatus and splitEvenly work on frozen input', () => {
    const frozen = deepFreeze(JSON.parse(JSON.stringify(sample)))
    expect(() => { total(frozen); categoryTotals(frozen); budgetStatus('food', 10); splitEvenly(10, 2) }).not.toThrow()
    expect(frozen).toEqual(sample)
  })
})

describe('AC5 – CLI report', () => {
  it('prints Total, one line per category and a Split line, exit code 0', () => {
    const r = spawnSync(process.execPath, ['src/cli.js', 'data/sample.json'], { encoding: 'utf8' })
    expect(r.status).toBe(0)
    expect(r.stdout).toMatch(/Total: 222\.55/)
    expect(r.stdout).toMatch(/food: 139\.25 \(limit 300, ok\)/)
    expect(r.stdout.match(/\(limit /g)).toHaveLength(4)
    expect(r.stdout).toMatch(/Split between 1: 222\.55/)
  })
})
