import { readFileSync } from 'node:fs'
import { total, categoryTotals, budgetStatus, budgetLimit, splitEvenly, validateExpenses } from './expense.js'

const file = process.argv[2]

if (!file) {
  console.error('Usage: node src/cli.js <expenses.json> [people]')
  process.exit(2)
}

try {
  const people = Number(process.argv[3] || 1)
  const expenses = validateExpenses(JSON.parse(readFileSync(file, 'utf8')))
  const sum = total(expenses)
  const cats = categoryTotals(expenses)
  const shares = splitEvenly(sum, people)

  console.log('Total: ' + sum.toFixed(2))
  for (const c of Object.keys(cats)) {
    console.log(c + ': ' + cats[c].toFixed(2) + ' (limit ' + budgetLimit(c) + ', ' + budgetStatus(c, cats[c]) + ')')
  }
  console.log('Split between ' + people + ': ' + shares.join(', '))
} catch (err) {
  console.error('Error: ' + (err && err.message ? err.message : String(err)))
  process.exit(2)
}
