import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

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
        notifications.show({
          title: "Error generating activity",
          classNames: classes,
          color: "red",
        });
      });
  },
});

export default analyticsSlice.reducer;
