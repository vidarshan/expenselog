import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

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

export const editAccount = createAsyncThunk(
  "accounts/edit",
  async ({ id, name, type, creditLimit, initialBalance }, thunkAPI) => {
    try {
      const res = await api.patch(`/accounts/${id}`, {
        name,
        type,
        creditLimit,
        initialBalance,
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Update failed";
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
        notifications.show({
          title: "Account Created",
          classNames: classes,
        });
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
      })
      .addCase(editAccount.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(editAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const id = action.meta.arg.id;
        const updated = action.payload;
        state.accounts = state.accounts.map((a) =>
          a._id === id ? { ...a, ...updated } : a,
        );
        notifications.show({
          title: "Account Updated",
          classNames: classes,
        });
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      });
  },
});

export default accountsSlice.reducer;
