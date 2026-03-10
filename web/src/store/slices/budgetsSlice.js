import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  budgets: [],
  loading: false,
  error: "",
};

export const getBudgets = createAsyncThunk(
  "bugets/get",
  async ({ year, month }, thunkAPI) => {
    try {
      const res = await api.get("/budget", {
        params: { year, month },
      });
      const data = res.data;

      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
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
      });
  },
});

export default budgetsSlice.reducer;
