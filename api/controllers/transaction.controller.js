import mongoose from "mongoose";
import MonthlyLog from "../models/MonthlyLog.js";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";

function computeDelta(accountType, txType, amount) {
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) throw new Error("Amount must be > 0");

  // cash/bank behave normally: income increases, expense decreases
  if (accountType === "cash" || accountType === "bank") {
    return txType === "income" ? +amt : -amt;
  }

  // credit: currentBalance = amount you owe (simple model)
  // expense increases debt, income (payment) reduces debt
  if (accountType === "credit") {
    return txType === "expense" ? +amt : -amt;
  }

  throw new Error("Invalid account type");
}

// helper: get or create monthly log for a given date
async function getOrCreateMonthlyLog({ userId, date, session }) {
  const d = date ? new Date(date) : new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;

  let log = await MonthlyLog.findOne({ userId, year, month }).session(session);
  if (!log) {
    const [created] = await MonthlyLog.create([{ userId, year, month }], {
      session,
    });
    log = created;
  }
  return log;
}

export const deleteTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const txId = new mongoose.Types.ObjectId(req.params.id);

    const tx = await Transaction.findOne({
      _id: txId,
      userId,
      isDeleted: false,
    }).session(session);

    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const account = await Account.findOne({
      _id: tx.accountId,
      userId,
      isDeleted: false,
    }).session(session);

    if (!account) return res.status(404).json({ message: "Account not found" });

    const delta = computeDelta(account.type, tx.type, tx.amount);

    tx.isDeleted = true;
    await tx.save({ session });

    // revert its effect on balance
    await Account.updateOne(
      { _id: account._id },
      { $inc: { currentBalance: -delta } },
      { session },
    );

    await session.commitTransaction();
    return res.json({ ok: true });
  } catch (e) {
    await session.abortTransaction();
    return res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

export const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { accountId, type, amount, categoryId, date, source, name } =
      req.body;

    if (!accountId) throw new Error("accountId is required");
    if (!type || !["income", "expense"].includes(type))
      throw new Error("type must be 'income' or 'expense'");
    if (type === "expense" && !categoryId)
      throw new Error("categoryId is required for expense");

    const account = await Account.findOne({
      _id: new mongoose.Types.ObjectId(accountId),
      userId,
      isDeleted: false,
    }).session(session);

    if (!account) return res.status(404).json({ message: "Account not found" });

    const delta = computeDelta(account.type, type, amount);

    const log = await getOrCreateMonthlyLog({ userId, date, session });

    const [tx] = await Transaction.create(
      [
        {
          userId,
          logId: log._id,
          accountId: account._id,
          type,
          amount: Number(amount),
          name: name ?? "Transaction",
          categoryId: type === "expense" ? categoryId : undefined,
          categoryName: type === "expense" ? "Expense" : "Income", // optional; adjust if you store real names
          date: date ? new Date(date) : new Date(),
          source: source ?? undefined, // your schema defines object; keep undefined unless you use it
          isDeleted: false,
        },
      ],
      { session },
    );

    await Account.updateOne(
      { _id: account._id },
      { $inc: { currentBalance: delta } },
      { session },
    );

    await session.commitTransaction();
    return res.status(201).json(tx);
  } catch (e) {
    await session.abortTransaction();
    return res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

export const updateTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const txId = new mongoose.Types.ObjectId(req.params.id);
    const patch = req.body ?? {};

    const tx = await Transaction.findOne({
      _id: txId,
      userId,
      isDeleted: false,
    }).session(session);

    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const oldAccount = await Account.findOne({
      _id: tx.accountId,
      userId,
      isDeleted: false,
    }).session(session);

    if (!oldAccount)
      return res.status(404).json({ message: "Account not found" });

    const oldDelta = computeDelta(oldAccount.type, tx.type, tx.amount);

    const newAccountId = patch.accountId ?? tx.accountId;
    const newType = patch.type ?? tx.type;
    const newAmount = patch.amount ?? tx.amount;

    const newAccount = await Account.findOne({
      _id: new mongoose.Types.ObjectId(newAccountId),
      userId,
      isDeleted: false,
    }).session(session);

    if (!newAccount)
      return res.status(404).json({ message: "New account not found" });

    const newDelta = computeDelta(newAccount.type, newType, newAmount);

    // if date changes, logId may need to change
    let newLogId = tx.logId;
    if (patch.date) {
      const log = await getOrCreateMonthlyLog({
        userId,
        date: patch.date,
        session,
      });
      newLogId = log._id;
      tx.date = new Date(patch.date);
    }

    // update tx fields
    tx.accountId = new mongoose.Types.ObjectId(newAccountId);
    tx.type = newType;
    tx.amount = Number(newAmount);
    tx.logId = newLogId;

    if (patch.name !== undefined) tx.name = patch.name;
    if (patch.categoryId !== undefined) tx.categoryId = patch.categoryId;

    await tx.save({ session });

    // revert old effect
    await Account.updateOne(
      { _id: oldAccount._id },
      { $inc: { currentBalance: -oldDelta } },
      { session },
    );

    // apply new effect
    await Account.updateOne(
      { _id: newAccount._id },
      { $inc: { currentBalance: newDelta } },
      { session },
    );

    await session.commitTransaction();
    return res.json(tx);
  } catch (e) {
    await session.abortTransaction();
    return res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

export const getTransactionsByMonth = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const year = parseInt(req.query.year, 10);
    const month = parseInt(req.query.month, 10);

    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return res.status(400).json({ message: "year and month are required" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const monthlyLog = await MonthlyLog.findOne({ userId, year, month }).lean();

    if (!monthlyLog) {
      return res.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const [transactions, total] = await Promise.all([
      Transaction.find({
        userId,
        logId: monthlyLog._id,
        isDeleted: false,
      })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Transaction.countDocuments({
        userId,
        logId: monthlyLog._id,
        isDeleted: false,
      }),
    ]);

    return res.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
