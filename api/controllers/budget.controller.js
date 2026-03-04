const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

exports.getBudgetOverview = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month) {
      return res.status(400).json({ message: "Year and month required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const budgets = await Budget.find({
      userId,
      year,
      month,
      isDeleted: false,
    }).lean();

    const spentByCategory = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          isDeleted: false,
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$categoryId",
          spent: { $sum: "$amount" },
        },
      },
    ]);

    const spentMap = new Map(
      spentByCategory.map((x) => [String(x._id), x.spent]),
    );

    const items = budgets.map((b) => {
      const spent = spentMap.get(String(b.categoryId)) || 0;
      const remaining = b.limit - spent;
      const pctUsed = b.limit === 0 ? 0 : spent / b.limit;

      let status = "ok";
      if (spent > b.limit) status = "over";
      else if (pctUsed >= 0.85) status = "warning";

      return {
        categoryId: b.categoryId,
        limit: b.limit,
        spent,
        remaining,
        pctUsed,
        status,
      };
    });

    const budgetedIds = new Set(budgets.map((b) => String(b.categoryId)));

    const unbudgeted = spentByCategory
      .filter((x) => !budgetedIds.has(String(x._id)))
      .map((x) => ({
        categoryId: x._id,
        spent: x.spent,
      }));

    const totalLimit = items.reduce((s, i) => s + i.limit, 0);
    const totalSpentBudgeted = items.reduce((s, i) => s + i.spent, 0);
    const totalSpentAll = spentByCategory.reduce((s, x) => s + x.spent, 0);

    res.json({
      period: { year, month },
      items,
      unbudgeted,
      summary: {
        totalLimit,
        totalSpentBudgeted,
        totalSpentAll,
        overBudgetCount: items.filter((i) => i.status === "over").length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrEditBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month, categoryId, limit } = req.body;

    if (!year || !month || !categoryId || limit == null) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, year, month, categoryId },
      {
        $set: {
          limit,
          isDeleted: false,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.userId;

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      { isDeleted: true },
      { new: true },
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
