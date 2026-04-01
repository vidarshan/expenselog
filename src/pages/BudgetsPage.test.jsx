import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BudgetsPage from "./BudgetsPage";
import { createTestStore, renderWithProviders } from "../test/test-utils";
import api from "../api/axios";

vi.mock("../api/axios", async () => {
  const actual = await vi.importActual("../api/axios");

  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

vi.mock("react-helmet", () => ({
  Helmet: ({ children }) => children,
}));

describe("BudgetsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: {
        items: [
          {
            categoryId: "food",
            categoryName: "Food",
            spent: 90,
            limit: 100,
          },
          {
            categoryId: "travel",
            categoryName: "Travel",
            spent: 130,
            limit: 100,
          },
        ],
        unbudgeted: [
          {
            categoryId: "misc",
            categoryName: "Misc",
            spent: 22,
          },
        ],
        summary: {
          totalLimit: 200,
          totalSpentBudgeted: 220,
          totalSpentAll: 242,
          overBudgetCount: 1,
        },
      },
    });
  });

  it("renders fetched budget data and filters tracked categories by search", async () => {
    const store = createTestStore({
      app: {
        currentYear: "2026",
        currentMonth: "3",
        loading: false,
        error: "",
      },
      categories: {
        categories: [
          { _id: "food", name: "Food" },
          { _id: "travel", name: "Travel" },
        ],
        loading: false,
        error: "",
      },
      logs: {
        activePeriods: [{ year: 2026, months: [1, 2, 3] }],
        loading: false,
        error: "",
      },
    });

    renderWithProviders(<BudgetsPage />, { route: "/budgets", store });

    expect(await screen.findByText(/tracked categories/i)).toBeInTheDocument();
    expect(screen.getByText(/food/i)).toBeInTheDocument();
    expect(screen.getByText(/travel/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /unbudgeted spending/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/misc/i)).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText(/search category/i),
      "food",
    );

    await waitFor(() => {
      expect(screen.getByText(/^Food$/)).toBeInTheDocument();
      expect(screen.queryByText(/^Travel$/)).not.toBeInTheDocument();
    });
  });

  it("shows summary totals and opens the create budget modal", async () => {
    const store = createTestStore({
      app: {
        currentYear: "2026",
        currentMonth: "3",
        loading: false,
        error: "",
      },
      categories: {
        categories: [
          { _id: "food", name: "Food" },
          { _id: "travel", name: "Travel" },
        ],
        loading: false,
        error: "",
      },
      logs: {
        activePeriods: [{ year: 2026, months: [1, 2, 3] }],
        loading: false,
        error: "",
      },
    });

    renderWithProviders(<BudgetsPage />, { route: "/budgets", store });

    expect(await screen.findByText(/tracked categories/i)).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
    expect(screen.getByText("$220.00")).toBeInTheDocument();
    expect(screen.getByText("$242.00")).toBeInTheDocument();
    expect(screen.getByText(/^1$/)).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /create budget/i }),
    );

    expect(
      await screen.findByRole("dialog", { name: /create budget/i }),
    ).toBeInTheDocument();
  });
});
