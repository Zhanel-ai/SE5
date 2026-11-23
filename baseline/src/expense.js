// Expense calculator – core logic (baseline prototype).

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

export function budgetStatus(category, spent) {
  if (category === 'food') {
    return spent > 300 ? 'over' : 'ok'
  } else if (category === 'transport') {
    return spent > 120 ? 'over' : 'ok'
  } else if (category === 'fun') {
    return spent > 80 ? 'over' : 'ok'
  } else {
    return spent > 200 ? 'over' : 'ok'
  }
}

export function budgetLimit(category) {
  if (category === 'food') return 300
  if (category === 'transport') return 120
  if (category === 'fun') return 80
  return 200
}

export function splitEvenly(amount, people) {
  const share = Math.round((amount / people) * 100) / 100
  const shares = []
  for (let i = 0; i < people; i++) shares.push(share)
  return shares
}
