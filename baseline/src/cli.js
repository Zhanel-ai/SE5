import { readFileSync } from 'node:fs'
import { total, categoryTotals, budgetStatus, budgetLimit, splitEvenly } from './expense.js'

const file = process.argv[2]
const people = Number(process.argv[3] || 1)

const expenses = JSON.parse(readFileSync(file, 'utf8'))
const sum = total(expenses)

console.log('Total: ' + sum.toFixed(2))
const cats = categoryTotals(expenses)
for (const c of Object.keys(cats)) {
  console.log(c + ': ' + cats[c].toFixed(2) + ' (limit ' + budgetLimit(c) + ', ' + budgetStatus(c, cats[c]) + ')')
}
console.log('Split between ' + people + ': ' + splitEvenly(sum, people).join(', '))
