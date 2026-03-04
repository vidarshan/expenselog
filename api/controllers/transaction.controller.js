const MonthlyLog = require("../models/MonthlyLog");
const Transaction = require("../models/Transaction");
const { createMonthlyLog } = require("./logs.controller");

function computeDelta(accountType, txType, amount) {
  if (amount <= 0) throw new Error("Amount must be > 0");

  // cash/bank behave normally
  if (accountType === "cash" || accountType === "bank") {
    return txType === "income" ? +amount : -amount;
  }

  // credit: balance = amount you owe (simple model)
  if (accountType === "credit") {
    return txType === "expense" ? +amount : -amount; // income=payment
  }

  throw new Error("Invalid account type");
}

exports.deleteTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const txId = req.params.id;

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

    await Account.updateOne(
      { _id: account._id },
      { $inc: { currentBalance: -delta } },
      { session },
    );

    await session.commitTransaction();
    res.json({ ok: true });
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

exports.createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { accountId, type, amount, categoryId, date, source } = req.body;

    const account = await Account.findOne({
      _id: accountId,
      userId,
      isDeleted: false,
    }).session(session);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const delta = computeDelta(account.type, type, amount);

    const [tx] = await Transaction.create(
      [
        {
          userId,
          accountId,
          type, // "income" | "expense"
          amount, // positive
          categoryId: type === "expense" ? categoryId : undefined,
          date: date ? new Date(date) : new Date(),
          source: source || "manual",
          isDeleted: false,
        },
      ],
      { session },
    );

    await Account.updateOne(
      { _id: accountId },
      { $inc: { currentBalance: delta } },
      { session },
    );

    await session.commitTransaction();
    res.status(201).json(tx);
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

exports.updateTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const txId = req.params.id;
    const patch = req.body;

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
      _id: newAccountId,
      userId,
      isDeleted: false,
    }).session(session);
    if (!newAccount)
      return res.status(404).json({ message: "New account not found" });

    const newDelta = computeDelta(newAccount.type, newType, newAmount);

    // update tx
    tx.accountId = newAccountId;
    tx.type = newType;
    tx.amount = newAmount;
    if (patch.date) tx.date = new Date(patch.date);
    if (patch.categoryId !== undefined) tx.categoryId = patch.categoryId;
    await tx.save({ session });

    // revert old
    await Account.updateOne(
      { _id: oldAccount._id },
      { $inc: { currentBalance: -oldDelta } },
      { session },
    );
    // apply new
    await Account.updateOne(
      { _id: newAccount._id },
      { $inc: { currentBalance: newDelta } },
      { session },
    );

    await session.commitTransaction();
    res.json(tx);
  } catch (e) {
    await session.abortTransaction();
    res.status(400).json({ message: e.message });
  } finally {
    session.endSession();
  }
};

exports.getTransactionsByMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const monthlyLog = await MonthlyLog.findOne({
      userId: req.userId,
      year,
      month,
    });

    if (!monthlyLog) {
      return res.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    const [transactions, total] = await Promise.all([
      Transaction.find({
        userId: req.userId,
        logId: monthlyLog._id,
      })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),

      Transaction.countDocuments({
        userId: req.userId,
        logId: monthlyLog._id,
      }),
    ]);

    res.json({
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
    res.status(500).json({ message: err.message });
  }
};
