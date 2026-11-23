// Independent probes run by the human reviewer's assistant (read-only: they only import and call the code).
import { total, categoryTotals, budgetStatus, splitEvenly, addExpense } from '../expense-calc/src/expense.js'

const show = (label, fn) => {
  try { console.log(label.padEnd(58), '=>', JSON.stringify(fn())) }
  catch (e) { console.log(label.padEnd(58), '=> THROWS', e.constructor.name + ':', e.message) }
}
const sum = (a) => Math.round(a.reduce((x, y) => x + y, 0) * 100) / 100

show('P1 split 222.55 between 3 (shares)', () => splitEvenly(222.55, 3))
show('P1 sum of the 3 shares vs total 222.55', () => sum(splitEvenly(222.55, 3)))
show('P1 split 10 between 3, sum of shares', () => sum(splitEvenly(10, 3)))
show('P2 total with amount "abc"', () => total([{ category: 'food', amount: 'abc' }]))
show('P2 total with amount "5" (string)', () => total([{ category: 'food', amount: '5' }, { category: 'food', amount: 1 }]))
show('P2 total with negative amount -50 and 20', () => total([{ category: 'food', amount: -50 }, { category: 'food', amount: 20 }]))
show('P2 total with amount NaN/missing', () => total([{ category: 'food' }]))
show('P3 categoryTotals category "constructor"', () => categoryTotals([{ category: 'constructor', amount: 5 }]))
show('P3 categoryTotals category "__proto__"', () => Object.keys(categoryTotals([{ category: '__proto__', amount: 5 }])))
show('P3 categoryTotals category "toString" twice', () => categoryTotals([{ category: 'toString', amount: 5 }, { category: 'toString', amount: 7 }]))
show('P4 splitEvenly(10, 0)', () => splitEvenly(10, 0))
show('P4 splitEvenly(10, -2)', () => splitEvenly(10, -2))
show('P4 splitEvenly(10, 2.5) length', () => splitEvenly(10, 2.5).length)
show('P4 splitEvenly(10, NaN)', () => splitEvenly(10, NaN))
show('P5 addExpense mutates its input list', () => { const l = []; addExpense(l, { category: 'x', amount: 1 }); return l.length })
show('P6 total of a non-array JSON object', () => total({ a: 1 }))
show('P7 AC2 float: sum of category totals vs total (0.1+0.2, 0.7+0.1)', () => {
  const list = [{ category: 'a', amount: 0.1 }, { category: 'a', amount: 0.2 }, { category: 'b', amount: 0.7 }, { category: 'b', amount: 0.1 }]
  return { total: total(list), rawCategorySums: Object.values(categoryTotals(list)) }
})
show('P8 budgetStatus with NaN spent', () => budgetStatus('food', NaN))
