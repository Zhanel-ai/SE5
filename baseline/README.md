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

## Test

```bash
npm test
```
