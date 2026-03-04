import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import logReducer from "./slices/logSlice";
import transactionsReducer from "./slices/transactionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    logs: logReducer,
    transactions: transactionsReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
