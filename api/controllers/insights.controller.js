const OpenAI = require("openai");
const { default: Insight } = require("../models/Insight");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const aiProfile = {
  tone: "tough-love", // "friendly" | "professional"
  goal: "save_more", // "reduce_discretionary" | "pay_debt" | "build_emergency_fund"
  riskTolerance: "medium", // "low" | "high"
  focusCategories: ["Food", "Entertainment"],
};

exports.getInsights = async (req, res) => {
  try {
    const { month } = req.query;
    const userId = req.user?.id || req.user?._id || req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!month) return res.status(400).json({ message: "Month is required" });

    // (optional) cache
    const existing = await Insight.findOne({ userId, month });
    if (existing) return res.json(existing.insights);

    // You SHOULD replace this with your real buildMonthlySummary()
    // but it works with your current "summary" too.
    const summary = {
      month: "2026-02",
      totalIncome: 3200,
      totalExpenses: 2500,
      savings: 700,
      savingsRate: 21.8,
      topCategories: [
        { name: "Food", amount: 900 },
        { name: "Rent", amount: 1200 },
      ],
      monthOverMonthChange: { expenses: 8.2, income: 0 },
      essentialRatio: 0.73,
      discretionaryRatio: 0.27,

      // OPTIONAL: if you can compute these, AI becomes 10x better
      // categoryDeltas: [{ name: "Food", deltaAmount: 120, deltaPct: 18.0 }, ...]
      // repeatMerchants: [{ name: "Starbucks", count: 9, total: 72.5 }, ...]
      // anomalies: [{ description: "One-time purchase", amount: 180, category: "Auto" }, ...]
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are a personalized financial coach inside an expense tracking app.

Hard rules:
- Speak in second person ("you"). Never say "the individual".
- Do NOT restate dashboard numbers (income/expenses/savings/rates) unless needed as evidence for a deeper point.
- Focus on: behavioral patterns, root causes, concentration, risk exposure, and specific next actions.
- Be concrete: use caps, limits, weekly targets, and small experiments.
- If the data doesn't include something (e.g., last 10 transactions), say "check" rather than inventing.
- Return strictly valid JSON only.
Tone must follow aiProfile.tone; prioritize aiProfile.goal; adjust strictness to aiProfile.riskTolerance; prioritize aiProfile.focusCategories.
`,
        },
        {
          role: "user",
          content: `
aiProfile:
${JSON.stringify(aiProfile, null, 2)}

Return STRICT JSON in exactly this shape:

{
  "behavioral_insights": [
    { "title": string, "message": string, "evidence": string }
  ],
  "root_cause_hypotheses": [
    { "title": string, "message": string, "what_to_check_next": string }
  ],
  "micro_challenges": [
    { "title": string, "rules": string[], "target": string, "why": string }
  ],
  "risk_flags": [
    { "title": string, "message": string, "severity": "low"|"medium"|"high" }
  ],
  "forecast": {
    "title": string,
    "message": string,
    "assumption": string
  },
  "next_best_move": {
    "title": string,
    "message": string,
    "first_step_today": string
  }
}

Financial summary (dashboard already shows totals — add NEW value beyond that):
${JSON.stringify(summary, null, 2)}
`,
        },
      ],
    });

    let parsed;
    try {
      parsed = JSON.parse(completion.choices[0].message.content);
    } catch {
      parsed = {
        behavioral_insights: [],
        root_cause_hypotheses: [],
        micro_challenges: [],
        risk_flags: [],
        forecast: {
          title: "Forecast unavailable",
          message: "We couldn't generate a forecast this time.",
          assumption: "N/A",
        },
        next_best_move: {
          title: "Next step unavailable",
          message: "We couldn't generate next steps this time.",
          first_step_today: "Try again later.",
        },
      };
    }

    // Normalize to avoid schema issues even if model slips
    const normalized = {
      behavioral_insights: Array.isArray(parsed.behavioral_insights)
        ? parsed.behavioral_insights
        : [],
      root_cause_hypotheses: Array.isArray(parsed.root_cause_hypotheses)
        ? parsed.root_cause_hypotheses
        : [],
      micro_challenges: Array.isArray(parsed.micro_challenges)
        ? parsed.micro_challenges
        : [],
      risk_flags: Array.isArray(parsed.risk_flags) ? parsed.risk_flags : [],
      forecast: parsed.forecast || null,
      next_best_move: parsed.next_best_move || null,
    };

    await Insight.create({ userId, month, insights: normalized });

    return res.json(normalized);
  } catch (err) {
    console.error("AI Insights Error:", err);
    return res.status(500).json({ message: "Failed to generate insights" });
  }
};
