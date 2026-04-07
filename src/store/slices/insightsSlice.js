import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  insights: {},
  loading: false,
  error: "",
};

export const getInsights = createAsyncThunk(
  "insights/get",
  async ({ year, month, forceRefresh = false }, thunkAPI) => {
    try {
      const m = `${year}-${String(month).padStart(2, "0")}`;
      const res = await api.get("/insights", {
        params: { month: m, forceRefresh },
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInsights.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.insights = action.payload || [];
      })
      .addCase(getInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      });
  },
});

export default insightsSlice.reducer;
