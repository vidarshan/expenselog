import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import logReducer from "./slices/logSlice";
import transactionsReducer from "./slices/transactionsSlice";
import categoryReducer from "./slices/categorySlice";
import accountsReducer from "./slices/accountsSlice";
import appReducer from "./slices/appSlice";
import budgetsReducer from "./slices/budgetsSlice";
import analyticsReducer from "./slices/analyticsSlice";
import insightsReducer from "./slices/insightsSlice";

export const store = configureStore({
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
  devTools: import.meta.env.MODE !== "production",
});
