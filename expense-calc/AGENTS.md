# AGENTS.md – expense-calc

## Purpose
Small command-line expense calculator. It reads a JSON list of expenses and prints the total, the total per category with a budget status, and an even split between people. All data is fictional; there is no network, database or login.

## Architecture
- `src/expense.js` – pure business logic (`validateExpenses`, `total`, `categoryTotals`, `budgetStatus`, `budgetLimit`, `splitEvenly`, `addExpense`). No `process`, `console` or file access here.
- `src/cli.js` – entry point: reads argv and a JSON file, validates and calls the logic, prints the report. It is the only place that prints or exits. Exit codes: 0 success, 2 usage or input error (one `Error: ...` line on stderr, no stack trace).
- `data/sample.json` – fictional sample expenses `{ name, category, amount }`; `amount` is a finite number >= 0.
- `tests/` – Vitest tests (`npm test`): `expense.test.js`, `acceptance.test.js` (AC1–AC5), `split.test.js`, `validation.test.js`.
- No build step, no linter and no type checker are configured yet.

## Setup
Node.js 18 or newer. `npm install` once, then use the commands below.

## Safe commands (allowed without asking)
`npm test`, `npm start`, `node src/cli.js <file> [people]`, `git status`, `git diff`, `git log`, `git add`, `git commit` on a task branch.

## Permissions and review gates
- You may edit only `src/`, `tests/`, `data/`, `README.md` and `AGENTS.md`, and only what the task names. Do not touch `package.json` or `package-lock.json` unless the task is a named dependency change.
- Work on a task branch, never on `main`. Before asking for a merge, give a change summary, the full `git diff`, the real `npm test` output and a list of checks not run.
- A human reviews the diff and approves in writing before anything is merged. An agent claim without a recorded command output is treated as unverified.
- Known open risks are tracked in the report's risk register (for example category names such as `constructor` in `categoryTotals`, and vitest advisories); do not "fix" them as a side effect of another task.

## Forbidden actions
- No secrets, tokens, passwords or `.env` files in code, tests, docs or commits; do not read or print environment secrets.
- No production deployment, `npm publish`, or any network call other than the npm registry.
- No destructive commands: `rm -rf`, `git reset --hard`, `git push --force`, deleting branches, deleting or rewriting history, deleting tests.
- No unreviewed dependency changes: do not run `npm install <package>`, `npm update`, or `npm audit fix --force` unless the task names the change and a human reviews the diff.
- No real personal or financial data; use fictional data only.
- Do not merge or push to the main branch; work on a task branch and wait for human approval.

## Coding conventions
ES modules, 2-space indent, no semicolons, small pure functions, no side effects in `src/expense.js`. Keep changes minimal and within the task; no unrelated refactoring.

## Acceptance criteria (must stay true after every change)
- AC1: `total(list)` equals the sum of all amounts rounded to 2 decimals; an empty list gives 0.
- AC2: the values of `categoryTotals(list)` add up (rounded to 2 decimals) to `total(list)`.
- AC3: `budgetStatus` is `ok` when spent <= limit and `over` when spent > limit; limits: food 300, transport 120, fun 80, any other category 200.
- AC4: `total`, `categoryTotals`, `budgetStatus` and `splitEvenly` never modify their input.
- AC5: `node src/cli.js data/sample.json` prints a Total line, one line per category and a Split line, and exits with code 0.

## Test expectations
Run `npm test` before reporting any change; all tests must pass. Every behaviour change needs a regression test. Report changed files, the test output (pass/fail counts) and any check that was not run. Never claim a test passed unless it was actually executed.
