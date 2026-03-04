import mongoose from "mongoose";
import MonthlyLog from "../models/MonthlyLog.js";
import Transaction from "../models/Transaction.js";

function parseYearMonth(req) {
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!Number.isInteger(year) || year < 2000 || year > 3000) {
    return { error: "Invalid year" };
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { error: "Invalid month (1-12)" };
  }
  return { year, month };
}

function prevYearMonth(year, month) {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

async function ensureMonthlyLog(userId, year, month) {
  let log = await MonthlyLog.findOne({ userId, year, month });
  if (!log) {
    log = await MonthlyLog.create({ userId, year, month });
  }
  return log;
}

async function aggregateSummary(logId) {
  const rows = await Transaction.aggregate([
    { $match: { logId } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  let income = 0;
  let expenses = 0;
  let txCount = 0;

  for (const r of rows) {
    txCount += r.count;
    if (r._id === "income") income = r.total;
    if (r._id === "expense") expenses = r.total;
  }

  const net = income - expenses;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  return { income, expenses, net, savingsRate, txCount };
}

async function buildBudgetProgress() {
  return [];
}

async function aggregateRecentTransactions(logId) {
  return Transaction.find({ logId })
    .sort({ date: -1, createdAt: -1 })
    .limit(6)
    .select("name amount type date categoryName")
    .lean();
}

async function aggregateCategoryBreakdown(userId, year, month) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  return Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "expense",
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        name: { $first: { $ifNull: ["$categoryName", "Uncategorized"] } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
    {
      $project: {
        _id: 0,
        categoryId: "$_id",
        categoryName: "$name",
        total: 1,
      },
    },
  ]);
}

async function aggregateMonthCategoryTotals(userId, start, end) {
  return Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "expense",
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { $ifNull: ["$categoryName", "Uncategorized"] },
        total: { $sum: "$amount" },
      },
    },
  ]);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthLabel(year, month) {
  return `${MONTHS[month - 1]} ${year}`;
}

function monthRange(year, month) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

async function buildCategoryMonthlyComparison(userId, year, month) {
  const { start, end } = monthRange(year, month);
  const prev = prevYearMonth(year, month);
  const { start: prevStart, end: prevEnd } = monthRange(prev.year, prev.month);

  const [curr, prevRows] = await Promise.all([
    aggregateMonthCategoryTotals(userId, start, end),
    aggregateMonthCategoryTotals(userId, prevStart, prevEnd),
  ]);

  const currTotals = {};
  for (const r of curr) currTotals[r._id] = r.total;

  const prevTotals = {};
  for (const r of prevRows) prevTotals[r._id] = r.total;

  const labelA = monthLabel(prev.year, prev.month);
  const labelB = monthLabel(year, month);

  const categories = Array.from(
    new Set([...Object.keys(currTotals), ...Object.keys(prevTotals)]),
  );

  return categories.map((cat) => ({
    category: cat,
    [labelA]: prevTotals[cat] ?? 0,
    [labelB]: currTotals[cat] ?? 0,
  }));
}

async function buildCategoryCompareAnyTwoMonths(
  userId,
  yearA,
  monthA,
  yearB,
  monthB,
) {
  const { start: startA, end: endA } = monthRange(yearA, monthA);
  const { start: startB, end: endB } = monthRange(yearB, monthB);

  const [aRows, bRows] = await Promise.all([
    aggregateMonthCategoryTotals(userId, startA, endA),
    aggregateMonthCategoryTotals(userId, startB, endB),
  ]);

  const labelA = monthLabel(yearA, monthA);
  const labelB = monthLabel(yearB, monthB);

  const aTotals = {};
  for (const r of aRows) aTotals[r._id] = r.total;

  const bTotals = {};
  for (const r of bRows) bTotals[r._id] = r.total;

  const categories = Array.from(
    new Set([...Object.keys(aTotals), ...Object.keys(bTotals)]),
  );

  return {
    labels: { a: labelA, b: labelB },
    data: categories.map((cat) => ({
      category: cat,
      [labelA]: aTotals[cat] ?? 0,
      [labelB]: bTotals[cat] ?? 0,
    })),
  };
}

export const getCategoryComparison = async (req, res) => {
  try {
    const userId = req.userId;

    const yearA = Number(req.query.yearA);
    const monthA = Number(req.query.monthA);
    const yearB = Number(req.query.yearB);
    const monthB = Number(req.query.monthB);

    if (!yearA || !monthA || !yearB || !monthB) {
      return res.status(400).json({
        message: "yearA/monthA/yearB/monthB are required",
      });
    }

    const result = await buildCategoryCompareAnyTwoMonths(
      userId,
      yearA,
      monthA,
      yearB,
      monthB,
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to compare months" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const { year, month, error } = parseYearMonth(req);
    if (error) return res.status(400).json({ message: error });

    const userId = req.userId;

    const log = await ensureMonthlyLog(userId, year, month);

    const prev = prevYearMonth(year, month);
    const prevLog = await MonthlyLog.findOne({
      userId,
      year: prev.year,
      month: prev.month,
    }).lean();

    const [summary, categoryBreakdown, recentTransactions, monthlyComparison] =
      await Promise.all([
        aggregateSummary(log._id),
        aggregateCategoryBreakdown(userId, year, month),
        aggregateRecentTransactions(log._id),
        buildCategoryMonthlyComparison(userId, year, month),
      ]);

    let prevSummary = {
      income: 0,
      expenses: 0,
      net: 0,
      savingsRate: 0,
      txCount: 0,
    };
    if (prevLog) prevSummary = await aggregateSummary(prevLog._id);

    const comparison = {
      lastMonth: { year: prev.year, month: prev.month },
      incomeDiff: summary.income - prevSummary.income,
      expensesDiff: summary.expenses - prevSummary.expenses,
      netDiff: summary.net - prevSummary.net,
    };

    const budgets = await buildBudgetProgress(userId, year, month, log._id);

    return res.json({
      meta: { year, month, logId: log._id.toString() },
      summary,
      categoryBreakdown,
      recentTransactions,
      monthlyComparison,
      comparison,
      budgets,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};
