# expense-calc

A small command-line expense calculator. It reads a JSON list of expenses, prints the total, the
total per category with a simple budget status, and an even split between people.
All data is fictional.

## Run

```bash
npm install
npm start                      # uses data/sample.json
node src/cli.js data/sample.json 3   # split between 3 people
```

## Input and exit codes

The file must be a JSON list of `{ "name": "...", "category": "...", "amount": <number >= 0> }`.
`people` is a positive integer (default 1). On success the exit code is 0; on a usage or input error
the program prints one `Error: ...` line to stderr and exits with code 2.

## Test

```bash
npm test
```
