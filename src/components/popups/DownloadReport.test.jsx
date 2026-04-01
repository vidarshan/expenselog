import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DownloadReport from "./DownloadReport";
import { createTestStore, renderWithProviders } from "../../test/test-utils";
import { exportFinancialReport } from "../../utils/reportExport";

vi.mock("../../utils/reportExport", () => ({
  exportFinancialReport: vi.fn(() => Promise.resolve()),
}));

describe("DownloadReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes already loaded insights for the current monthly period", async () => {
    const onClose = vi.fn();
    const store = createTestStore({
      app: {
        currentYear: "2026",
        currentMonth: "3",
        loading: false,
        error: "",
      },
      insights: {
        insights: {
          summary: "Spending increased on food.",
          tips: ["Review restaurant purchases"],
        },
        loading: false,
        error: "",
      },
    });

    renderWithProviders(
      <DownloadReport
        opened
        onClose={onClose}
        activePeriods={[{ year: 2026, months: [1, 2, 3] }]}
        defaultYear="2026"
        defaultMonth="3"
      />,
      { store },
    );

    await userEvent.click(
      screen.getByRole("button", { name: /download march report/i }),
    );

    expect(exportFinancialReport).toHaveBeenCalledWith({
      reportType: "monthly",
      year: "2026",
      month: "3",
      activePeriods: [{ year: 2026, months: [1, 2, 3] }],
      insightsByPeriod: {
        "2026-03": {
          summary: "Spending increased on food.",
          tips: ["Review restaurant purchases"],
        },
      },
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("submits a yearly report request without forcing insights fetches", async () => {
    const onClose = vi.fn();
    const store = createTestStore({
      app: {
        currentYear: "2026",
        currentMonth: "3",
        loading: false,
        error: "",
      },
      insights: {
        insights: {},
        loading: false,
        error: "",
      },
    });

    renderWithProviders(
      <DownloadReport
        opened
        onClose={onClose}
        activePeriods={[{ year: 2026, months: [1, 2, 3] }]}
        defaultYear="2026"
        defaultMonth="3"
      />,
      { store },
    );

    await userEvent.click(screen.getByRole("radio", { name: /yearly/i }));
    await userEvent.click(
      screen.getByRole("button", { name: /download 2026 report/i }),
    );

    expect(exportFinancialReport).toHaveBeenCalledWith({
      reportType: "yearly",
      year: "2026",
      month: "3",
      activePeriods: [{ year: 2026, months: [1, 2, 3] }],
      insightsByPeriod: {},
    });
    expect(onClose).toHaveBeenCalled();
  });
});
