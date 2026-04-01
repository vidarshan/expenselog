import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import api from "../api/axios";
import PrintableReport from "../components/reports/PrintableReport";
import { months as getMonthNames } from "./getCurrentPeriod";

const MONTH_NAMES = getMonthNames();

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getCategoryName(transaction) {
  return transaction.categoryName || transaction.category?.name || "Unassigned";
}

function getInsightCount(insights) {
  if (!insights) return 0;

  return (
    (insights.behavioral_insights?.length || 0) +
    (insights.root_cause_hypotheses?.length || 0) +
    (insights.micro_challenges?.length || 0) +
    (insights.risk_flags?.length || 0) +
    (insights.forecast ? 1 : 0) +
    (insights.next_best_move ? 1 : 0)
  );
}

async function fetchMonthTransactions(year, month) {
  const limit = 250;
  let page = 1;
  let totalPages = 1;
  const all = [];

  while (page <= totalPages) {
    const res = await api.get("/transactions", {
      params: { year, month, page, limit },
    });

    const payload = res.data || { data: [], pagination: {} };
    all.push(...(payload.data || []));
    totalPages = payload.pagination?.totalPages || 1;
    page += 1;
  }

  return all;
}

async function fetchDashboardSummary(year, month) {
  try {
    const res = await api.get("/dashboard", {
      params: { year, month },
    });

    return res.data || {};
  } catch {
    return {};
  }
}

async function fetchBudgetDetails(year, month) {
  try {
    const res = await api.get("/budget", {
      params: { year, month },
    });

    return (
      res.data || {
        items: [],
        unbudgeted: [],
        summary: {
          totalLimit: 0,
          totalSpentBudgeted: 0,
          totalSpentAll: 0,
          overBudgetCount: 0,
        },
      }
    );
  } catch {
    return {
      items: [],
      unbudgeted: [],
      summary: {
        totalLimit: 0,
        totalSpentBudgeted: 0,
        totalSpentAll: 0,
        overBudgetCount: 0,
      },
    };
  }
}

async function fetchHeatmap(year) {
  try {
    const res = await api.get("/analytics", {
      params: { year },
    });

    return res.data?.data || [];
  } catch {
    return [];
  }
}

function summarizeTransactions(transactions) {
  return transactions.reduce(
    (acc, tx) => {
      const amount = Number(tx.amount || 0);

      if (tx.type === "income") acc.income += amount;
      if (tx.type === "expense") acc.expenses += amount;

      acc.count += 1;
      return acc;
    },
    { income: 0, expenses: 0, count: 0 },
  );
}

function buildCategoryBreakdown(transactions) {
  const expenseMap = transactions.reduce((acc, tx) => {
    if (tx.type !== "expense") return acc;

    const key = getCategoryName(tx);
    acc[key] = (acc[key] || 0) + Number(tx.amount || 0);
    return acc;
  }, {});

  const total = Object.values(expenseMap).reduce((sum, value) => sum + value, 0);

  return Object.entries(expenseMap)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total === 0 ? 0 : Number(((value / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);
}

function buildLegend(items) {
  if (!items.length) return "";

  return `
    <div class="chart-legend">
      ${items
        .map(
          ({ label, color }) => `
            <div class="legend-item">
              <span class="legend-swatch" style="background:${color}"></span>
              <span>${escapeHtml(label)}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function buildBarChart({ title, subtitle, eyebrow = "Overview", bars, legend = [] }) {
  if (!bars.length) {
    return `
      <div class="chart-card">
        <div class="chart-copy">
          <p class="chart-eyebrow">${escapeHtml(eyebrow)}</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <div class="chart-empty">No chart data is available for this period yet.</div>
      </div>
    `;
  }

  const width = 640;
  const height = 240;
  const margin = { top: 18, right: 16, bottom: 46, left: 44 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const step = innerWidth / bars.length;
  const barWidth = Math.max(
    12,
    Math.min(44, step / Math.max(1, legend.length || 1) - 8),
  );
  const maxValue = Math.max(
    ...bars.flatMap((bar) => bar.values.map((item) => item.value)),
    1,
  );
  const seriesCount = Math.max(...bars.map((bar) => bar.values.length), 1);
  const gridValues = Array.from({ length: 4 }, (_, index) =>
    Number(((maxValue / 4) * (4 - index)).toFixed(2)),
  );

  const gridLines = gridValues
    .map((value) => {
      const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
      return `
        <line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" class="chart-grid-line" />
        <text x="${margin.left - 8}" y="${y + 4}" class="chart-axis-label chart-axis-label-left">${escapeHtml(
          `$${Math.round(value)}`,
        )}</text>
      `;
    })
    .join("");

  const barsSvg = bars
    .map((bar, barIndex) => {
      const baseX =
        margin.left + barIndex * step + (step - seriesCount * barWidth) / 2;
      const columns = bar.values
        .map((item, seriesIndex) => {
          const barHeight = (item.value / maxValue) * innerHeight;
          const x = baseX + seriesIndex * barWidth;
          const y = margin.top + innerHeight - barHeight;

          return `
            <rect
              x="${x}"
              y="${y}"
              width="${Math.max(barWidth - 4, 8)}"
              height="${Math.max(barHeight, 0)}"
              rx="8"
              ry="8"
              fill="${item.color}"
            />
          `;
        })
        .join("");

      const labelX = margin.left + barIndex * step + step / 2;

      return `
        ${columns}
        <text x="${labelX}" y="${height - 12}" text-anchor="middle" class="chart-axis-label">${escapeHtml(
          bar.label,
        )}</text>
      `;
    })
    .join("");

  return `
    <div class="chart-card">
      <div class="chart-copy">
        <p class="chart-eyebrow">${escapeHtml(eyebrow)}</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      ${buildLegend(legend)}
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" role="img" aria-label="${escapeHtml(title)}">
        ${gridLines}
        <line x1="${margin.left}" y1="${margin.top + innerHeight}" x2="${width - margin.right}" y2="${margin.top + innerHeight}" class="chart-base-line" />
        ${barsSvg}
      </svg>
    </div>
  `;
}

function buildContributionChart({ title, subtitle, items }) {
  if (!items.length) {
    return `
      <div class="chart-card">
        <div class="chart-copy">
          <p class="chart-eyebrow">Contribution</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <div class="chart-empty">No category expense data is available for this period yet.</div>
      </div>
    `;
  }

  const topItems = items.slice(0, 6);
  const maxValue = Math.max(...topItems.map((item) => item.value), 1);

  return `
    <div class="chart-card">
      <div class="chart-copy">
        <p class="chart-eyebrow">Contribution</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="contribution-list">
        ${topItems
          .map((item, index) => {
            const width = Math.max((item.value / maxValue) * 100, 6);
            return `
              <div class="contribution-item">
                <div class="contribution-head">
                  <span>${escapeHtml(item.name)}</span>
                  <strong>${formatMoney(item.value)} • ${item.percentage}%</strong>
                </div>
                <div class="contribution-track">
                  <span class="contribution-fill contribution-fill-${index % 4}" style="width:${width}%"></span>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function buildBudgetChart({ title, subtitle, summary }) {
  const totalLimit = Number(summary?.totalLimit || 0);
  const totalSpent = Number(
    summary?.totalSpentBudgeted ?? summary?.totalSpent ?? 0,
  );
  const remaining = Math.max(totalLimit - totalSpent, 0);
  const overspent = Math.max(totalSpent - totalLimit, 0);
  const usagePercent =
    totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;

  return `
    <div class="chart-card">
      <div class="chart-copy">
        <p class="chart-eyebrow">Budget</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="budget-stats">
        <div class="budget-stat"><span>Planned</span><strong>${formatMoney(totalLimit)}</strong></div>
        <div class="budget-stat"><span>Spent</span><strong>${formatMoney(totalSpent)}</strong></div>
        <div class="budget-stat"><span>${overspent > 0 ? "Over budget" : "Remaining"}</span><strong>${formatMoney(
          overspent > 0 ? overspent : remaining,
        )}</strong></div>
      </div>
      ${
        totalLimit > 0
          ? `
            <div class="budget-track">
              <span class="budget-fill" style="width:${usagePercent}%"></span>
            </div>
            <div class="budget-foot">
              <span>${formatMoney(totalSpent)} of ${formatMoney(totalLimit)}</span>
              <strong class="${overspent > 0 ? "text-danger" : "text-success"}">
                ${overspent > 0 ? `${formatMoney(overspent)} over` : `${Math.round(usagePercent)}% used`}
              </strong>
            </div>
          `
          : `<div class="chart-empty">No budget limits are set for this period.</div>`
      }
    </div>
  `;
}

function buildHeatmapChart({ title, subtitle, heatmap, year, month }) {
  const filtered = month
    ? heatmap.filter((item) => new Date(item.date).getMonth() + 1 === Number(month))
    : heatmap;

  if (!filtered.length) {
    return `
      <div class="chart-card">
        <div class="chart-copy">
          <p class="chart-eyebrow">Activity</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <div class="chart-empty">No spending activity data is available for this period yet.</div>
      </div>
    `;
  }

  const values = filtered.map((item) => Number(item.total || 0));
  const max = Math.max(...values, 1);

  return `
    <div class="chart-card">
      <div class="chart-copy">
        <p class="chart-eyebrow">Activity</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="heatmap-grid ${month ? "heatmap-grid-month" : ""}">
        ${filtered
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((item) => {
            const amount = Number(item.total || 0);
            const intensity = amount / max;
            const alpha = 0.18 + intensity * 0.72;
            const date = new Date(item.date);
            const dayLabel = month
              ? String(date.getDate()).padStart(2, "0")
              : `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}`;

            return `
              <div class="heatmap-cell" style="background:rgba(95,106,242,${alpha.toFixed(2)})">
                <span>${escapeHtml(dayLabel)}</span>
                <strong>${formatMoney(amount)}</strong>
              </div>
            `;
          })
          .join("")}
      </div>
      <div class="heatmap-foot">${filtered.length} active ${month ? "days" : "entries"} in ${
        month ? `${MONTH_NAMES[Number(month) - 1]} ${year}` : year
      }</div>
    </div>
  `;
}

function buildMonthlyOverviewChart(section) {
  const summary = summarizeTransactions(section.transactions);
  const net = Math.max(summary.income - summary.expenses, 0);

  return buildBarChart({
    title: `${MONTH_NAMES[Number(section.month) - 1]} ${section.year} snapshot`,
    subtitle: "Dashboard overview, showing income, expenses, and positive net.",
    bars: [
      {
        label: MONTH_NAMES[Number(section.month) - 1].slice(0, 3),
        values: [
          { value: summary.income, color: "#84b63d" },
          { value: summary.expenses, color: "#ff6b6b" },
          { value: net, color: "#5f6af2" },
        ],
      },
    ],
    legend: [
      { label: "Income", color: "#84b63d" },
      { label: "Expenses", color: "#ff6b6b" },
      { label: "Net", color: "#5f6af2" },
    ],
  });
}

function buildYearOverviewChart(sections) {
  return buildBarChart({
    title: "Monthly totals across the year",
    subtitle: "Each month is grouped into income, expenses, and positive net.",
    bars: sections.map((section) => {
      const summary = summarizeTransactions(section.transactions);
      return {
        label: MONTH_NAMES[Number(section.month) - 1].slice(0, 3),
        values: [
          { value: summary.income, color: "#84b63d" },
          { value: summary.expenses, color: "#ff6b6b" },
          { value: Math.max(summary.income - summary.expenses, 0), color: "#5f6af2" },
        ],
      };
    }),
    legend: [
      { label: "Income", color: "#84b63d" },
      { label: "Expenses", color: "#ff6b6b" },
      { label: "Net", color: "#5f6af2" },
    ],
  });
}

function buildRows(transactions) {
  return transactions.map((tx) => ({
    name: tx.name,
    category: getCategoryName(tx),
    type: tx.type,
    date: formatDate(tx.date),
    time: tx.time || "N/A",
    amount: formatMoney(tx.amount),
  }));
}

function getBudgetStatus(spent, limit) {
  if (limit <= 0) return spent > 0 ? "Over" : "OK";
  if (spent > limit) return "Over";
  if (spent / limit >= 0.85) return "Warning";
  return "OK";
}

function getPrintStyles() {
  return `
    @page { size: A4 portrait; margin: 10mm 8mm; }
    body { margin: 0; background: #fff; font-size: 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .report-root { padding: 0; }
    .report-cover, .report-section { page-break-inside: avoid; }
    .chart-card { display: block; width: 100%; border: 1px solid var(--mantine-color-gray-3, #dee2e6); border-radius: 16px; padding: 12px; background: linear-gradient(180deg, rgba(132,182,61,0.08), rgba(255,255,255,0.98)); }
    .report-stat-card { background: linear-gradient(180deg, rgba(132,182,61,0.08), rgba(255,255,255,0.98)); }
    .report-insight-card { background: linear-gradient(180deg, rgba(230,73,128,0.08), rgba(255,255,255,0.98)); }
    .chart-copy h3 { margin: 0; font-size: 15px; }
    .chart-copy p { margin: 4px 0 0; color: #667085; line-height: 1.45; font-size: 11px; }
    .chart-eyebrow { margin: 0 0 4px; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #667085; }
    .chart-legend { display: flex; flex-wrap: wrap; gap: 6px 10px; margin-top: 10px; margin-bottom: 8px; }
    .legend-item { display: inline-flex; align-items: center; gap: 8px; color: #667085; font-size: 10px; font-weight: 700; }
    .legend-swatch { width: 10px; height: 10px; border-radius: 999px; }
    .chart-svg { width: 100%; height: auto; display: block; }
    .chart-grid-line, .chart-base-line { stroke: #dde4eb; stroke-width: 1; }
    .chart-axis-label { fill: #667085; font-family: Manrope, sans-serif; font-size: 9px; font-weight: 700; }
    .chart-axis-label-left { text-anchor: end; }
    .contribution-list { display: grid; gap: 9px; margin-top: 12px; }
    .contribution-item { display: grid; gap: 8px; }
    .contribution-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; font-size: 11px; }
    .contribution-head strong { white-space: nowrap; font-size: 10px; }
    .contribution-track, .budget-track { width: 100%; overflow: hidden; border-radius: 999px; background: #e9eef3; }
    .contribution-track { height: 10px; }
    .budget-track { height: 14px; margin-top: 12px; }
    .contribution-fill, .budget-fill { display: block; height: 100%; border-radius: inherit; }
    .budget-fill { background: linear-gradient(90deg, #84b63d, #5f6af2); }
    .contribution-fill-0 { background: #ff922b; }
    .contribution-fill-1 { background: #5f6af2; }
    .contribution-fill-2 { background: #84b63d; }
    .contribution-fill-3 { background: #22b8cf; }
    .chart-empty { margin-top: 12px; padding: 12px; border: 1px dashed #dde4eb; border-radius: 12px; color: #667085; background: rgba(255,255,255,0.72); font-size: 11px; }
    .budget-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
    .budget-stat { padding: 9px; border: 1px solid #edf1f5; border-radius: 12px; background: rgba(255,255,255,0.78); }
    .budget-stat span { display: block; font-size: 11px; font-weight: 700; color: #667085; text-transform: uppercase; letter-spacing: .08em; }
    .budget-stat strong { display: block; margin-top: 6px; font-size: 13px; font-weight: 800; }
    .budget-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; font-size: 10px; color: #667085; }
    .text-danger { color: #ff6b6b; }
    .text-success { color: #84b63d; }
    .heatmap-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; margin-top: 12px; }
    .heatmap-grid-month { grid-template-columns: repeat(7, minmax(0, 1fr)); }
    .heatmap-cell { min-height: 42px; padding: 6px; border-radius: 10px; color: #fff; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
    .heatmap-cell span { display: block; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.92); text-transform: uppercase; letter-spacing: .06em; }
    .heatmap-cell strong { display: block; margin-top: 6px; font-size: 12px; font-weight: 800; }
    .heatmap-foot { margin-top: 8px; color: #667085; font-size: 10px; }
    .report-table th, .report-table td { font-size: 10px; padding: 8px 7px; }
    @media print { body { background: #fff; } }
  `;
}

function getDocumentStyleTags() {
  return Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((node) => node.outerHTML)
    .join("\n");
}

function buildReportData({ reportType, year, month, sections }) {
  const totals = sections
    .map((section) => summarizeTransactions(section.transactions))
    .reduce(
      (acc, item) => ({
        income: acc.income + item.income,
        expenses: acc.expenses + item.expenses,
        count: acc.count + item.count,
      }),
      { income: 0, expenses: 0, count: 0 },
    );

  const yearlyBudgetSummary = sections.reduce(
    (acc, section) => {
      acc.totalLimit += Number(section.dashboard?.budgets?.summary?.totalLimit || 0);
      acc.totalSpent += Number(
        section.budgetDetails?.summary?.totalSpentBudgeted ??
          section.dashboard?.budgets?.summary?.totalSpent ??
          0,
      );
      return acc;
    },
    { totalLimit: 0, totalSpent: 0 },
  );

  const insights = sections
    .filter((section) => getInsightCount(section.insights) > 0)
    .map((section) => ({
      label: `${MONTH_NAMES[Number(section.month) - 1]} ${section.year}`,
      count: getInsightCount(section.insights),
      behavioral: section.insights?.behavioral_insights?.[0] || null,
      risk: section.insights?.risk_flags?.[0] || null,
      forecast: section.insights?.forecast || null,
      nextMove: section.insights?.next_best_move || null,
    }));

  return {
    periodLabel:
      reportType === "yearly"
        ? String(year)
        : `${MONTH_NAMES[Number(month) - 1]} ${year}`,
    totals: {
      income: formatMoney(totals.income),
      expenses: formatMoney(totals.expenses),
      count: totals.count,
    },
    overview:
      reportType === "yearly"
        ? {
            primaryLeft: buildYearOverviewChart(sections),
            primaryRight: buildBudgetChart({
              title: `${year} budget usage`,
              subtitle: "This yearly summary aggregates budget limits and spending across exported months.",
              summary: yearlyBudgetSummary,
            }),
            secondaryLeft: buildContributionChart({
              title: `${year} top spending categories`,
              subtitle: "This yearly view aggregates all expense categories from the selected year.",
              items: buildCategoryBreakdown(
                sections.flatMap((section) => section.transactions),
              ),
            }),
            secondaryRight: buildHeatmapChart({
              title: `${year} spending activity`,
              subtitle: "A print-safe view of the yearly activity heatmap.",
              heatmap: sections[0]?.heatmap || [],
              year,
            }),
          }
        : {
            primaryLeft: buildMonthlyOverviewChart(sections[0]),
            primaryRight: buildBudgetChart({
              title: "Budget usage",
              subtitle: "The monthly budget card carried into the exported report.",
              summary: sections[0]?.dashboard?.budgets?.summary,
            }),
            secondaryLeft: buildContributionChart({
              title: "Category contributions",
              subtitle: "This monthly breakdown highlights which categories are carrying the most weight.",
              items: buildCategoryBreakdown(sections[0].transactions),
            }),
            secondaryRight: buildHeatmapChart({
              title: "Spending activity",
              subtitle: "The monthly report includes day-level activity from the analytics heatmap.",
              heatmap: sections[0]?.heatmap || [],
              year,
              month,
            }),
          },
    insightsTitle:
      reportType === "yearly"
        ? `${year} AI insights`
        : `${MONTH_NAMES[Number(month) - 1]} ${year} AI insights`,
    insightsSubtitle:
      reportType === "yearly"
        ? "AI-generated observations and recommendations already available for exported months."
        : "AI-generated observations and recommendations already available for the selected month.",
    insights,
    sections: sections.map((section) => {
      const summary = summarizeTransactions(section.transactions);
      const label = `${MONTH_NAMES[Number(section.month) - 1]} ${section.year}`;

      return {
        label,
        summary: {
          income: formatMoney(summary.income),
          expenses: formatMoney(summary.expenses),
          net: formatMoney(summary.income - summary.expenses),
          count: summary.count,
        },
        charts: {
          topLeft: buildMonthlyOverviewChart(section),
          topRight: buildBudgetChart({
            title: "Budget usage",
            subtitle: "The same budget summary from the dashboard, adapted for print.",
            summary: section.budgetDetails?.summary || section.dashboard?.budgets?.summary,
          }),
          bottomLeft: buildContributionChart({
            title: "Category contributions",
            subtitle: "Expense categories ranked by share of spending.",
            items: buildCategoryBreakdown(section.transactions),
          }),
          bottomRight: buildHeatmapChart({
            title: "Spending activity",
            subtitle: "A compact day-by-day activity grid for the selected month.",
            heatmap: section.heatmap,
            year: section.year,
            month: section.month,
          }),
        },
        budgets: {
          summary: {
            totalLimit: formatMoney(section.budgetDetails?.summary?.totalLimit || 0),
            totalSpentBudgeted: formatMoney(
              section.budgetDetails?.summary?.totalSpentBudgeted || 0,
            ),
            totalSpentAll: formatMoney(
              section.budgetDetails?.summary?.totalSpentAll || 0,
            ),
            overBudgetCount: section.budgetDetails?.summary?.overBudgetCount || 0,
          },
          items: (section.budgetDetails?.items || [])
            .filter((item) => item.categoryName !== "Unknown")
            .map((item) => {
              const remaining = Number(item.limit || 0) - Number(item.spent || 0);
              const percent =
                Number(item.limit || 0) > 0
                  ? (Number(item.spent || 0) / Number(item.limit || 0)) * 100
                  : 0;

              return {
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                spent: formatMoney(item.spent),
                limit: formatMoney(item.limit),
                percent: `${percent.toFixed(0)}% used`,
                remaining: `$${Math.abs(remaining).toFixed(2)}`,
                remainingLabel: remaining < 0 ? "Over by" : "Remaining",
                status: getBudgetStatus(Number(item.spent || 0), Number(item.limit || 0)),
              };
            }),
          unbudgeted: (section.budgetDetails?.unbudgeted || []).map((item) => ({
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            spent: formatMoney(item.spent),
          })),
        },
        rows: buildRows(section.transactions),
      };
    }),
  };
}

function buildReportHtml({ reportType, year, month, sections }) {
  const report = buildReportData({ reportType, year, month, sections });
  const appStyles = getDocumentStyleTags();
  const markup = renderToStaticMarkup(
    createElement(PrintableReport, { report }),
  );

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title></title>
        ${appStyles}
        <style>${getPrintStyles()}</style>
      </head>
      <body>
        ${markup}
      </body>
    </html>
  `;
}

export async function exportFinancialReport({
  reportType,
  year,
  month,
  activePeriods,
  insightsByPeriod = {},
}) {
  const selectedYear = Number(year);
  const selectedMonth = Number(month);
  const yearlyHeatmap = await fetchHeatmap(selectedYear);

  const sections =
    reportType === "yearly"
      ? await Promise.all(
          [...(activePeriods.find((p) => p.year === selectedYear)?.months || [])]
            .sort((a, b) => a - b)
            .map(async (periodMonth) => {
              const [transactions, dashboard, budgetDetails] = await Promise.all([
                fetchMonthTransactions(selectedYear, periodMonth),
                fetchDashboardSummary(selectedYear, periodMonth),
                fetchBudgetDetails(selectedYear, periodMonth),
              ]);

              return {
                year: selectedYear,
                month: periodMonth,
                transactions,
                dashboard,
                budgetDetails,
                insights:
                  insightsByPeriod?.[`${selectedYear}-${String(periodMonth).padStart(2, "0")}`] ||
                  null,
                heatmap: yearlyHeatmap,
              };
            }),
        )
      : await Promise.all([
          (async () => {
            const [transactions, dashboard, budgetDetails] = await Promise.all([
              fetchMonthTransactions(selectedYear, selectedMonth),
              fetchDashboardSummary(selectedYear, selectedMonth),
              fetchBudgetDetails(selectedYear, selectedMonth),
            ]);

            return {
              year: selectedYear,
              month: selectedMonth,
              transactions,
              dashboard,
              budgetDetails,
              insights:
                insightsByPeriod?.[
                  `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`
                ] || null,
              heatmap: yearlyHeatmap,
            };
          })(),
        ]);

  if (!sections.length) {
    throw new Error("No report data is available for the selected period.");
  }

  const reportHtml = buildReportHtml({
    reportType,
    year: selectedYear,
    month: selectedMonth,
    sections,
  });

  const existingFrame = document.getElementById("expenselog-report-frame");
  if (existingFrame) existingFrame.remove();

  const printFrame = document.createElement("iframe");
  printFrame.id = "expenselog-report-frame";
  printFrame.style.position = "fixed";
  printFrame.style.right = "0";
  printFrame.style.bottom = "0";
  printFrame.style.width = "0";
  printFrame.style.height = "0";
  printFrame.style.border = "0";
  printFrame.setAttribute("aria-hidden", "true");
  document.body.appendChild(printFrame);

  const frameWindow = printFrame.contentWindow;
  const frameDocument = printFrame.contentDocument;

  if (!frameWindow || !frameDocument) {
    printFrame.remove();
    throw new Error("Unable to prepare the printable report.");
  }

  frameDocument.open();
  frameDocument.write(reportHtml);
  frameDocument.close();
  frameDocument.title = "";

  await new Promise((resolve) => {
    printFrame.onload = () => resolve();
    setTimeout(resolve, 300);
  });

  frameWindow.focus();
  frameWindow.print();

  frameWindow.onafterprint = () => {
    printFrame.remove();
  };
}
