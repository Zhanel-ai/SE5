// Expense calculator – core logic (baseline prototype).

export function validateExpenses(list) {
  if (!Array.isArray(list)) throw new TypeError('expenses must be a list')
  for (let i = 0; i < list.length; i++) {
    const e = list[i]
    const n = i + 1
    if (e === null || typeof e !== 'object') throw new TypeError('item ' + n + ': must be an object')
    if (typeof e.category !== 'string' || e.category === '') {
      throw new TypeError('item ' + n + ': category must be a non-empty string')
    }
    if (typeof e.amount !== 'number' || !Number.isFinite(e.amount) || e.amount < 0) {
      throw new TypeError('item ' + n + ': amount must be a finite number >= 0')
    }
  }
  return list
}

export function addExpense(list, expense) {
  list.push(expense)
  return list
}

export function total(list) {
  let sum = 0
  for (const e of list) sum += e.amount
  return Math.round(sum * 100) / 100
}

export function categoryTotals(list) {
  const result = {}
  for (const e of list) {
    if (!result[e.category]) result[e.category] = 0
    result[e.category] += e.amount
  }
  return result
}

// Budget limits per category (single source of truth); unknown categories use DEFAULT_LIMIT.
const BUDGET_LIMITS = { food: 300, transport: 120, fun: 80 }
const DEFAULT_LIMIT = 200

export function budgetLimit(category) {
  return Object.hasOwn(BUDGET_LIMITS, category) ? BUDGET_LIMITS[category] : DEFAULT_LIMIT
}

export function budgetStatus(category, spent) {
  return spent > budgetLimit(category) ? 'over' : 'ok'
}

export function splitEvenly(amount, people) {
  if (!Number.isInteger(people) || people < 1) throw new RangeError('people must be a positive integer')
  const cents = Math.round(amount * 100)
  const base = Math.floor(cents / people)
  const extra = cents - base * people
  const shares = []
  for (let i = 0; i < people; i++) shares.push((base + (i < extra ? 1 : 0)) / 100)
  return shares
}
