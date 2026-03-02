const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["cash", "bank", "credit"], required: true },
    initialBalance: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

accountSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Account", accountSchema);