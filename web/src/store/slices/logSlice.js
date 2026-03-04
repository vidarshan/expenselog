import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  logs: [],
  monthlyLogs: { data: [], pagination: {} },
  pagination: {},
  loading: false,
  error: "",
};

export const getActivePeriods = createAsyncThunk(
  "logs/active/get",
  async (_, thunkAPI) => {
    try {
      const logActiveRes = await api.get("/logs/active");
      const logData = logActiveRes.data;

      return logData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const getMonthlyLogs = createAsyncThunk(
  "logs/monthly/get",
  async ({ page, limit }, thunkAPI) => {
    try {
      const logActiveRes = await api.get("/logs/monthly", {
        params: { page, limit },
      });
      const logData = logActiveRes.data;

      return logData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActivePeriods.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getActivePeriods.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.logs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getActivePeriods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })
      .addCase(getMonthlyLogs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getMonthlyLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.monthlyLogs = action.payload;
      })
      .addCase(getMonthlyLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      });
  },
});

export default logsSlice.reducer;
