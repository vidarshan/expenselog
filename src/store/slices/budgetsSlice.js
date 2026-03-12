import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

const initialState = {
  budgets: {
    period: {
      year: null,
      month: null,
    },
    items: [],
    unbudgeted: [],
    summary: {
      totalLimit: 0,
      totalSpentBudgeted: 0,
      totalSpentAll: 0,
      overBudgetCount: 0,
    },
  },
  loading: false,
  error: "",
};

export const getBudgets = createAsyncThunk(
  "budgets/get",
  async ({ year, month }, thunkAPI) => {
    try {
      const res = await api.get("/budget", {
        params: { year, month },
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const createBudget = createAsyncThunk(
  "budgets/create",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/budget", payload);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Create failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBudgets.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.budgets = action.payload;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })

      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createBudget.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        notifications.show({
          title: "Budget created",
          classNames: classes,
        });
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create failed";
        notifications.show({
          title: "Error creating budget",
          classNames: classes,
          color: "red",
        });
      });
  },
});

export default budgetsSlice.reducer;
