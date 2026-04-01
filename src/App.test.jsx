import { Suspense } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import { createTestStore, renderWithProviders } from "./test/test-utils";
import api from "./api/axios";

vi.mock("./api/axios", async () => {
  const actual = await vi.importActual("./api/axios");

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

function setupDashboardApiMocks() {
  api.get.mockImplementation((url, config = {}) => {
    if (url === "/logs/active") {
      return Promise.resolve({
        data: [{ year: 2026, months: [1, 2, 3] }],
      });
    }

    if (url === "/accounts") {
      return Promise.resolve({
        data: [
          {
            _id: "acc-1",
            name: "Checking",
            type: "bank",
            initialBalance: 1000,
            currentBalance: 1400,
          },
        ],
      });
    }

    if (url === "/categories") {
      return Promise.resolve({
        data: [
          {
            _id: "cat-1",
            name: "Food",
            color: "orange",
          },
        ],
      });
    }

    if (url === "/transactions") {
      return Promise.resolve({
        data: {
          data: [],
          pagination: { page: 1, totalPages: 1, total: 0, limit: 20 },
        },
      });
    }

    if (url === "/insights") {
      return Promise.resolve({ data: {} });
    }

    if (url === "/analytics") {
      return Promise.resolve({ data: { data: [] } });
    }

    if (url === "/dashboard/compare") {
      return Promise.resolve({
        data: {
          labels: { a: "Feb 2026", b: "Mar 2026" },
          data: [],
        },
      });
    }

    if (url === "/dashboard") {
      const month = Number(config.params?.month || 1);
      return Promise.resolve({
        data: {
          meta: { year: 2026, month, logId: `${month}` },
          summary: {
            income: month * 1000,
            expenses: month * 400,
            net: month * 600,
            savingsRate: 60,
            txCount: month * 2,
          },
          categoryBreakdown: [
            {
              categoryName: "Food",
              color: "orange",
              total: month * 100,
            },
          ],
          recentTransactions: [
            {
              _id: `${month}`,
              name: `Transaction ${month}`,
              date: `2026-${String(month).padStart(2, "0")}-10`,
              amount: month * 25,
              categoryName: "Food",
              categoryColor: "orange",
            },
          ],
          budgets: {
            summary: {
              totalLimit: month * 500,
              totalSpentBudgeted: month * 200,
              totalSpent: month * 200,
            },
          },
        },
      });
    }

    return Promise.resolve({ data: {} });
  });
}

describe("App routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows report messaging on the home page", () => {
    renderWithProviders(<HomePage />, { route: "/" });

    expect(
      screen.getByText(/download polished monthly or yearly reports/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/monthly & yearly reports/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from the dashboard", async () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading page...</div>}>
        <App />
      </Suspense>,
      { route: "/dashboard" },
    );

    expect(await screen.findByText(/welcome back/i)).toBeInTheDocument();
  });

  it("supports switching the dashboard between monthly and yearly views", async () => {
    setupDashboardApiMocks();

    const preloadedState = {
      auth: {
        user: {
          token: "token",
          username: "Vidarshan",
          salary: { fixed: { amount: 0 }, type: "fixed", variable: [] },
        },
        loading: false,
        error: "",
      },
      app: {
        currentYear: "2026",
        currentMonth: "3",
        loading: false,
        error: "",
      },
    };

    renderWithProviders(<DashboardPage />, {
      route: "/dashboard",
      store: createTestStore(preloadedState),
    });

    expect(await screen.findByText(/review spending, budgets, and activity for march 2026/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/select month/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("radio", { name: /yearly/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/review spending, budgets, and activity for 2026/i),
      ).toBeInTheDocument();
    });

    expect(screen.queryByPlaceholderText(/select month/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/personalized financial signals/i)).not.toBeInTheDocument();
  });
});
