import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../store/slices/authSlice";
import dashboardReducer from "../store/slices/dashboardSlice";
import logReducer from "../store/slices/logSlice";
import transactionsReducer from "../store/slices/transactionsSlice";
import categoryReducer from "../store/slices/categorySlice";
import accountsReducer from "../store/slices/accountsSlice";
import appReducer from "../store/slices/appSlice";
import budgetsReducer from "../store/slices/budgetsSlice";
import analyticsReducer from "../store/slices/analyticsSlice";
import insightsReducer from "../store/slices/insightsSlice";

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      dashboard: dashboardReducer,
      logs: logReducer,
      transactions: transactionsReducer,
      categories: categoryReducer,
      accounts: accountsReducer,
      app: appReducer,
      budgets: budgetsReducer,
      analytics: analyticsReducer,
      insights: insightsReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  { route = "/", store = createTestStore(), withRouter = true } = {},
) {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light">
        {withRouter ? (
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        ) : (
          children
        )}
      </MantineProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
