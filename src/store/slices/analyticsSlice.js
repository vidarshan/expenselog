import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  heatmap: [],
  loading: false,
  error: "",
};

export const getHeatMap = createAsyncThunk(
  "analytics/getHeatMap",
  async (year, thunkAPI) => {
    try {
      const res = await api.get("/analytics", {
        params: { year },
      });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to fetch user";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHeatMap.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getHeatMap.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.heatmap = action.payload.data;
      })
      .addCase(getHeatMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch";
      });
  },
});

export default analyticsSlice.reducer;
