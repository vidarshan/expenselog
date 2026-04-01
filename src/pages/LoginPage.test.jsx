import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";
import { createTestStore, renderWithProviders } from "../test/test-utils";

vi.mock("react-helmet", () => ({
  Helmet: ({ children }) => children,
}));

describe("LoginPage", () => {
  it("shows client-side validation for an invalid email before submit", async () => {
    renderWithProviders(<LoginPage />, {
      route: "/login",
      store: createTestStore(),
    });

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "not-an-email",
    );
    await userEvent.type(
      screen.getByPlaceholderText(/••••••••/i),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
