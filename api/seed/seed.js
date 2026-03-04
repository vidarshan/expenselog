import "dotenv/config";
import mongoose from "mongoose";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// ✅ Works with CommonJS-exported models (module.exports = mongoose.model(...))
import "../models/User.js";
import "../models/Category.js";
import "../models/Account.js";
import "../models/MonthlyLog.js";
import "../models/Budget.js";
import "../models/Transaction.js";

const User = mongoose.model("User");
const Category = mongoose.model("Category");
const Account = mongoose.model("Account");
const MonthlyLog = mongoose.model("MonthlyLog");
const Budget = mongoose.model("Budget");
const Transaction = mongoose.model("Transaction");

// ----------------- helpers -----------------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min, max, decimals = 2) {
  const n = Math.random() * (max - min) + min;
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}
function randomDateInMonth(year, month) {
  const day = randInt(1, 28); // keep it simple
  const hour = randInt(8, 22);
  const minute = randInt(0, 59);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

// ----------------- config -----------------
const SEED = {
  // how much data
  monthsBack: 18, // create logs/budgets/transactions for last N months
  categoriesCount: 18,
  accounts: [
    { name: "Cash Wallet", type: "cash", initialBalance: 120 },
    { name: "TD Chequing", type: "bank", initialBalance: 2200 },
    { name: "CIBC Visa", type: "credit", initialBalance: 0, creditLimit: 3000 },
  ],

  // transaction volume
  incomesPerMonth: [2, 5], // min/max incomes per month
  expensesPerMonth: [35, 90], // min/max expenses per month

  // amounts
  incomeAmount: [200, 2200],
  expenseAmount: [4, 180],

  // budgets
  budgetLimit: [80, 900],
};

// names
const CATEGORY_NAMES = [
  "Food",
  "Groceries",
  "Rent",
  "Utilities",
  "Phone",
  "Internet",
  "Transport",
  "Gas",
  "Coffee",
  "Eating Out",
  "Entertainment",
  "Health",
  "Gym",
  "Shopping",
  "Subscriptions",
  "Education",
  "Gifts",
  "Travel",
  "Insurance",
  "Misc",
];

const INCOME_NAMES = [
  "Paycheque",
  "Tutoring",
  "Freelance",
  "Gift",
  "Reimbursement",
  "Refund",
];

const EXPENSE_NAMES = [
  "Grocery run",
  "Coffee",
  "Lunch",
  "Dinner",
  "Uber",
  "Bus pass",
  "Subscription",
  "Pharmacy",
  "Snacks",
  "Online order",
  "Fuel",
  "Bills",
];

async function ensureIndexes() {
  // Ensures unique indexes exist; helpful before large inserts/upserts
  await Promise.all([
    User.syncIndexes(),
    Category.syncIndexes(),
    Account.syncIndexes(),
    MonthlyLog.syncIndexes(),
    Budget.syncIndexes(),
    Transaction.syncIndexes(),
  ]);
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("Connected:", mongoose.connection.name);

  // await ensureIndexes();

  // ----------------- 1) create (or reuse) a user -----------------
  const email = "seed.user@expenselog.dev";
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      username: "Seed User",
      password: "hashed_password_here", // your auth system should hash; for seed, keep consistent with your login logic
      role: "user",
      salary: {
        type: "fixed",
        fixed: { amount: 3200 },
        variable: [],
      },
    });
    console.log("Created user:", user._id.toString());
  } else {
    console.log("Reusing user:", user._id.toString());
  }

  const userId = user._id;

  // ----------------- 2) categories -----------------
  // Insert a clean set (ignore duplicates). You can also deleteMany first if you want a reset.
  const desiredCategoryNames = Array.from(new Set(CATEGORY_NAMES)).slice(
    0,
    SEED.categoriesCount,
  );

  // Upsert categories (avoid duplicate key errors on unique index)
  await Category.bulkWrite(
    desiredCategoryNames.map((name) => ({
      updateOne: {
        filter: { userId, name, isDeleted: false },
        update: { $setOnInsert: { userId, name, isDeleted: false } },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  const categories = await Category.find({ userId, isDeleted: false }).lean();
  if (!categories.length) throw new Error("No categories created");

  // ----------------- 3) accounts -----------------
  await Account.bulkWrite(
    SEED.accounts.map((a) => ({
      updateOne: {
        filter: { userId, name: a.name, isDeleted: false },
        update: {
          $setOnInsert: {
            userId,
            name: a.name,
            type: a.type,
            initialBalance: a.initialBalance ?? 0,
            currentBalance: a.initialBalance ?? 0,
            creditLimit: a.creditLimit ?? 0,
            isDeleted: false,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  const accounts = await Account.find({ userId, isDeleted: false }).lean();
  const accountByType = {
    cash: accounts.find((a) => a.type === "cash"),
    bank: accounts.find((a) => a.type === "bank"),
    credit: accounts.find((a) => a.type === "credit"),
  };

  // ----------------- 4) months range -----------------
  const now = new Date();
  const months = [];
  for (let i = 0; i < SEED.monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  // ----------------- 5) create logs (upsert) -----------------
  await MonthlyLog.bulkWrite(
    months.map(({ year, month }) => ({
      updateOne: {
        filter: { userId, year, month },
        update: { $setOnInsert: { userId, year, month, isClosed: false } },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  const logs = await MonthlyLog.find({ userId }).lean();
  const logMap = new Map(logs.map((l) => [monthKey(l.year, l.month), l]));

  // ----------------- 6) budgets (upsert per month per category) -----------------
  const budgetOps = [];
  for (const m of months) {
    for (const c of categories) {
      // You might not want budgets for ALL categories; tweak if you want.
      const limit = randInt(SEED.budgetLimit[0], SEED.budgetLimit[1]);
      budgetOps.push({
        updateOne: {
          filter: { userId, year: m.year, month: m.month, categoryId: c._id },
          update: { $set: { limit, isDeleted: false } },
          upsert: true,
        },
      });
    }
  }
  // Do in chunks
  const chunkSize = 500;
  for (let i = 0; i < budgetOps.length; i += chunkSize) {
    await Budget.bulkWrite(budgetOps.slice(i, i + chunkSize), {
      ordered: false,
    });
  }

  // ----------------- 7) transactions (insertMany in batches) -----------------
  // We'll also compute balances locally and then write back once at the end.
  const balances = new Map(
    accounts.map((a) => [
      a._id.toString(),
      a.currentBalance ?? a.initialBalance ?? 0,
    ]),
  );

  // For credit accounts, treat “expense” as increasing owed (i.e., currentBalance becomes MORE negative),
  // but your app might represent it differently. Adjust if needed.
  function applyBalance(account, txnType, amount) {
    const key = account._id.toString();
    let bal = balances.get(key) ?? 0;

    if (account.type === "credit") {
      // expenses -> more debt (bal decreases)
      if (txnType === "expense") bal -= amount;
      else bal += amount; // income -> paying down card (bal increases toward 0)
      bal = clamp(bal, -account.creditLimit, account.creditLimit);
    } else {
      // cash/bank
      if (txnType === "expense") bal -= amount;
      else bal += amount;
    }

    balances.set(key, bal);
  }

  const allTxns = [];
  for (const { year, month } of months) {
    const log = logMap.get(monthKey(year, month));
    if (!log) continue;

    const incomesCount = randInt(
      SEED.incomesPerMonth[0],
      SEED.incomesPerMonth[1],
    );
    const expensesCount = randInt(
      SEED.expensesPerMonth[0],
      SEED.expensesPerMonth[1],
    );

    // incomes
    for (let i = 0; i < incomesCount; i++) {
      const account = pick([accountByType.bank, accountByType.cash])._id
        ? pick([accountByType.bank, accountByType.cash])
        : pick(accounts);

      const amount = randFloat(SEED.incomeAmount[0], SEED.incomeAmount[1]);
      const name = pick(INCOME_NAMES);

      allTxns.push({
        userId,
        logId: log._id,
        name,
        amount,
        type: "income",
        categoryId: null,
        accountId: account._id,
        categoryName: "Income",
        source: { type: "fixed", refId: new mongoose.Types.ObjectId() }, // adjust if your app validates refId; if not needed, remove
        date: randomDateInMonth(year, month),
      });

      applyBalance(account, "income", amount);
    }

    // expenses
    for (let i = 0; i < expensesCount; i++) {
      const category = pick(categories);
      const account = pick([
        accountByType.bank,
        accountByType.cash,
        accountByType.credit,
      ]);

      const amount = randFloat(SEED.expenseAmount[0], SEED.expenseAmount[1]);
      const name = pick(EXPENSE_NAMES);

      allTxns.push({
        userId,
        logId: log._id,
        name,
        amount,
        type: "expense",
        categoryId: category._id,
        accountId: account._id,
        categoryName: category.name,
        source: undefined,
        date: randomDateInMonth(year, month),
      });

      applyBalance(account, "expense", amount);
    }
  }

  // Insert transactions in batches
  const txnBatch = 2000;
  let inserted = 0;

  for (let i = 0; i < allTxns.length; i += txnBatch) {
    const slice = allTxns.slice(i, i + txnBatch);
    const res = await Transaction.insertMany(slice, { ordered: false });
    inserted += res.length;
    console.log(`Inserted txns: ${inserted}/${allTxns.length}`);
  }

  // ----------------- 8) write back account balances -----------------
  const balanceOps = accounts.map((a) => ({
    updateOne: {
      filter: { _id: a._id },
      update: {
        $set: {
          currentBalance:
            balances.get(a._id.toString()) ?? a.currentBalance ?? 0,
        },
      },
    },
  }));
  await Account.bulkWrite(balanceOps, { ordered: false });

  console.log("DONE ✅");
  console.log({
    months: months.length,
    categories: categories.length,
    accounts: accounts.length,
    transactionsInserted: inserted,
  });

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
