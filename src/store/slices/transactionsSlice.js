import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

const initialState = {
  transactions: {
    data: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  },
  loading: false,
  mutating: false,
  error: "",
};

export const getTransactions = createAsyncThunk(
  "transactions/get",
  async ({ year, month, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const res = await api.get("/transactions", {
        params: { year, month, page, limit },
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/transactions", payload);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Create failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, patch }, thunkAPI) => {
    try {
      const res = await api.patch(`/transactions/${id}`, patch);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Update failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed";
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
      })

      .addCase(createTransaction.pending, (state) => {
        state.mutating = true;
        state.error = "";
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.mutating = false;
        state.error = "";

        notifications.show({
          title: "Log Created",
          classNames: classes,
        });
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload || "Create failed";
      })

      .addCase(updateTransaction.pending, (state) => {
        state.mutating = true;
        state.error = "";
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.mutating = false;
        state.error = "";

        const updated = action.payload;

        state.transactions.data = (state.transactions.data || []).map((t) =>
          t._id === updated._id ? updated : t,
        );
        notifications.show({
          title: "Log Updated",
          classNames: classes,
        });
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload || "Update failed";
      })

      .addCase(deleteTransaction.pending, (state) => {
        state.mutating = true;
        state.error = "";
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.mutating = false;
        state.error = "";

        const id = action.payload;

        state.transactions.data = (state.transactions.data || []).filter(
          (t) => t._id !== id,
        );
        notifications.show({
          title: "Log Deleted",
          classNames: classes,
          variant: "error",
        });
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export default transactionSlice.reducer;
