import { total, categoryTotals, budgetStatus } from '../expense-calc/src/expense.js'
const line = (l, v) => console.log(l.padEnd(70), '=>', v)
const l1 = [{ category: 'food', amount: 100.1 }, { category: 'food', amount: 100.1 }, { category: 'food', amount: 99.8 }]
line('R2 raw food sum of 100.1+100.1+99.8', categoryTotals(l1).food)
line('R2 status for that raw sum (limit 300)', budgetStatus('food', categoryTotals(l1).food))
const l2 = [{ category: 'a', amount: 0.005 }, { category: 'b', amount: 0.005 }, { category: 'c', amount: 0.005 }]
line('R2 printed per-category (toFixed2) sum vs total, 3 x 0.005', Object.values(categoryTotals(l2)).map((v) => v.toFixed(2)).join('+') + ' vs total ' + total(l2))
line('R10 Math.round(1.005*100)/100 (what total(1.005) gives)', total([{ category: 'x', amount: 1.005 }]))
line('R2 total of 1.15 + 1.15 + 1.15 in cents-free floats', total([{ category: 'x', amount: 1.15 }, { category: 'x', amount: 1.15 }, { category: 'x', amount: 1.15 }]))
