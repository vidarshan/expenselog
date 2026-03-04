const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlyLog",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
    categoryName: {
      type: String,
      required: true,
    },
    source: {
      type: {
        type: String,
        enum: ["fixed", "variable"],
        required: function () {
          return this.type === "income";
        },
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: function () {
          return this.type === "income";
        },
      },
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);
transactionSchema.index({ userId: 1, logId: 1, date: -1 });
transactionSchema.index({ userId: 1, logId: 1, type: 1 });
transactionSchema.index({ userId: 1, logId: 1, categoryId: 1 });
module.exports = mongoose.model("Transaction", transactionSchema);
