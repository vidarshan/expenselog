import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  dashboard: {
    meta: {
      year: 2026,
      month: 1,
      logId: "",
    },
    summary: {
      income: 0,
      expenses: 0,
      net: 0,
      savingsRate: 0,
      txCount: 0,
    },
    categoryBreakdown: [],
    recentTransactions: [],
    comparison: {
      lastMonth: {
        year: 2026,
        month: 1,
      },
      incomeDiff: 0,
      expensesDiff: 0,
      netDiff: 0,
    },
    budgets: [],
  },
  monthlyComparison: {
    labels: {
      a: "",
      b: "",
    },
    data: [],
  },
  loading: false,
  error: "",
};

export const getDashboard = createAsyncThunk(
  "dashboard/get",
  async ({ year, month }, thunkAPI) => {
    try {
      const dashboardRes = await api.get("/dashboard", {
        params: { year, month },
      });
      const dashboardData = dashboardRes.data;

      return dashboardData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const getComparisons = createAsyncThunk(
  "dashboard/compare/get",
  async ({ yearA, monthA, yearB, monthB }, thunkAPI) => {
    try {
      const compareRes = await api.get(`/dashboard/compare`, {
        params: { yearA, monthA, yearB, monthB },
      });
      const compareData = compareRes.data;

      return compareData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.dashboard = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })
      .addCase(getComparisons.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getComparisons.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.monthlyComparison = action.payload;
      })
      .addCase(getComparisons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      });
  },
});

export default dashboardSlice.reducer;
