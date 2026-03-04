import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  transactions: {
    pagination: {
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0,
    },
    data: [],
  },
  loading: false,
  error: "",
};

export const getTransactions = createAsyncThunk(
  "transactions/get",
  async ({ year, month, page, limit }, thunkAPI) => {
    try {
      const transactionsRes = await api.get("/transactions", {
        params: { year, month, page, limit },
      });
      const transactionsData = transactionsRes.data;

      return transactionsData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.transactions = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      });
  },
});

export default transactionSlice.reducer;
