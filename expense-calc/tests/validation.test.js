// Regression tests for risk R2 (no input validation; the CLI crashes with a stack trace).
import { describe, it, expect } from 'vitest'
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { validateExpenses } from '../src/expense.js'

const sample = JSON.parse(readFileSync(new URL('../data/sample.json', import.meta.url), 'utf8'))

describe('validateExpenses', () => {
  it('accepts the fictional sample data', () => {
    expect(() => validateExpenses(sample)).not.toThrow()
  })
  const bad = {
    'a JSON object instead of a list': {},
    null: null,
    'a string': 'x',
    'an item that is null': [null],
    'a string amount': [{ category: 'food', amount: '12.5' }],
    'a NaN amount': [{ category: 'food', amount: NaN }],
    'an Infinity amount': [{ category: 'food', amount: Infinity }],
    'a negative amount': [{ category: 'food', amount: -5 }],
    'a missing amount': [{ category: 'food' }],
    'a missing category': [{ amount: 5 }],
    'an empty category': [{ category: '', amount: 5 }],
  }
  for (const [label, input] of Object.entries(bad)) {
    it(`throws a TypeError with a clear message for ${label}`, () => {
      expect(typeof validateExpenses).toBe('function') // a missing function would also "throw" a TypeError
      expect(() => validateExpenses(input)).toThrow(TypeError)
      expect(() => validateExpenses(input)).toThrow(/^(expenses must be a list|item \d+: )/)
    })
  }
  it('names the position of the bad item', () => {
    expect(() => validateExpenses([{ category: 'food', amount: 1 }, { category: 'food', amount: 'x' }])).toThrow(/item 2/)
  })
})

describe('CLI error handling', () => {
  const dir = mkdtempSync(join(tmpdir(), 'expense-calc-'))
  const write = (name, text) => { const p = join(dir, name); writeFileSync(p, text); return p }
  const run = (...args) => spawnSync(process.execPath, ['src/cli.js', ...args], { encoding: 'utf8', cwd: new URL('..', import.meta.url) })
  const friendly = (r) => {
    expect(r.status).toBe(2)
    expect(r.stderr).toMatch(/^Error: /)
    expect(r.stderr).not.toMatch(/\n\s+at /) // no stack trace
  }
  it('no file argument prints usage and exits 2', () => {
    const r = run()
    expect(r.status).toBe(2)
    expect(r.stderr).toMatch(/Usage:/)
  })
  it('missing file exits 2 with a one-line error', () => friendly(run(join(dir, 'missing.json'))))
  it('invalid JSON exits 2 with a one-line error', () => friendly(run(write('bad.json', 'not json'))))
  it('non-list JSON exits 2 with a one-line error', () => friendly(run(write('obj.json', '{"a":1}'))))
  it('a string amount exits 2 with a one-line error', () => friendly(run(write('str.json', '[{"category":"food","amount":"abc"}]'))))
  it('an invalid people count exits 2 with a one-line error', () => friendly(run('data/sample.json', 'abc')))
  it('valid input with 3 people still exits 0 and splits without losing a cent', () => {
    const r = run('data/sample.json', '3')
    expect(r.status).toBe(0)
    expect(r.stdout).toMatch(/Split between 3: 74\.19, 74\.18, 74\.18/)
  })
})
