import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AccountsPage from "./AccountsPage";
import { createTestStore, renderWithProviders } from "../test/test-utils";

vi.mock("react-helmet", () => ({
  Helmet: ({ children }) => children,
}));

describe("AccountsPage", () => {
  it("opens the create account modal from the top header", async () => {
    const store = createTestStore({
      accounts: {
        accounts: [],
        loading: false,
        error: "",
      },
    });

    renderWithProviders(<AccountsPage />, {
      route: "/accounts",
      store,
    });

    expect(screen.getByText(/you have no accounts/i)).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    expect(
      await screen.findByText(/create an account to track balances/i),
    ).toBeInTheDocument();
  });
});
