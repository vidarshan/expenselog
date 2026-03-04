import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  accounts: [],
  loading: false,
  error: "",
};

export const getAccounts = createAsyncThunk(
  "accounts/get",
  async (_, thunkAPI) => {
    try {
      const categoryRes = await api.get("/accounts");
      const categoryData = categoryRes.data;

      return categoryData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const createAccount = createAsyncThunk(
  "accounts/create",
  async ({ name, type, initialBalance, creditLimit }, thunkAPI) => {
    try {
      const categoryRes = await api.post("/accounts", {
        name,
        type,
        initialBalance,
        creditLimit,
      });
      const categoryData = categoryRes.data;

      return categoryData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Create failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id, thunkAPI) => {
    try {
      const categoryRes = await api.delete(`/accounts/${id}`);
      const categoryData = categoryRes.data;

      return categoryData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccounts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.accounts = action.payload;
      })
      .addCase(getAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.accounts = [action.payload, ...state.accounts];
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create failed";
      })
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const id = action.meta.arg;
        state.accounts = state.accounts.filter((a) => a._id !== id);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export default accountsSlice.reducer;
