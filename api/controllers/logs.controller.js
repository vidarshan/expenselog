const MonthlyLog = require("../models/MonthlyLog");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getActivePeriods = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const logs = await MonthlyLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$year",
          months: { $addToSet: "$month" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const result = logs.map((y) => ({
      year: y._id,
      months: y.months.sort((a, b) => a - b),
    }));

    return res.json(result);
  } catch (err) {
    console.error("getActivePeriods error:", err);
    return res.status(500).json({ message: "Failed to fetch active periods" });
  }
};

exports.createMonthlyLog = async (req, res) => {
  try {
    const date = new Date();
    const userId = req.userId;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let log = await MonthlyLog.findOne({ userId, year, month });

    if (!log) {
      log = await MonthlyLog.create({
        userId,
        year,
        month,
      });
    }

    res.status(201).json(log);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Operation failed" });
  }
};

async function summarizeLog(logId) {
  const [stats] = await Transaction.aggregate([
    { $match: { logId: new mongoose.Types.ObjectId(logId) } },
    {
      $group: {
        _id: null,
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
        txCount: { $sum: 1 },
      },
    },
  ]);

  const income = stats?.income ?? 0;
  const expenses = stats?.expenses ?? 0;
  const txCount = stats?.txCount ?? 0;

  return {
    income,
    expenses,
    outcome: income - expenses,
    txCount,
  };
}

exports.getMonthlyLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      MonthlyLog.find({ userId: req.userId })
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MonthlyLog.countDocuments({ userId: req.userId }),
    ]);

    // add computed fields per log
    const enriched = await Promise.all(
      logs.map(async (log) => {
        const s = await summarizeLog(log._id);
        return {
          ...log,
          income: s.income,
          expenses: s.expenses,
          outcome: s.outcome,
          status: log.isClosed ? "Closed" : "Open",
          transactions: s.txCount,
        };
      }),
    );

    res.json({
      data: enriched,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

exports.getYearlyLogs = async (req, res) => {
  try {
    const yearlyLogs = await MonthlyLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$year",
          months: {
            $push: {
              _id: "$_id",
              month: "$month",
              isClosed: "$isClosed",
              createdAt: "$createdAt",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(yearlyLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
