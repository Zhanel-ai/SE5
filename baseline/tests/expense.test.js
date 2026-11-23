import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { total, categoryTotals, budgetStatus, budgetLimit, splitEvenly } from '../src/expense.js'

const sample = JSON.parse(readFileSync(new URL('../data/sample.json', import.meta.url), 'utf8'))

describe('total', () => {
  it('sums the sample expenses', () => {
    expect(total(sample)).toBe(222.55)
  })
  it('returns 0 for an empty list', () => {
    expect(total([])).toBe(0)
  })
})

describe('categoryTotals', () => {
  it('groups the sample by category', () => {
    expect(categoryTotals(sample)).toEqual({ food: 139.25, transport: 45, fun: 25.9, office: 12.4 })
  })
})

describe('budgetStatus', () => {
  it('is ok exactly at the food limit and over just above it', () => {
    expect(budgetStatus('food', 300)).toBe('ok')
    expect(budgetStatus('food', 300.01)).toBe('over')
  })
  it('uses the default limit for unknown categories', () => {
    expect(budgetLimit('office')).toBe(200)
    expect(budgetStatus('office', 200.5)).toBe('over')
  })
})

describe('splitEvenly', () => {
  it('splits 10 between 2 people', () => {
    expect(splitEvenly(10, 2)).toEqual([5, 5])
  })
})
