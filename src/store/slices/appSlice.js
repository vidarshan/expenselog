import { createSlice } from "@reduxjs/toolkit";

const now = new Date();

const initialState = {
  currentYear: now.getFullYear().toString(),
  currentMonth: (now.getMonth() + 1).toString(),
  loading: false,
  error: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setYear: (state, action) => {
      state.currentYear = action.payload;
    },

    setMonth: (state, action) => {
      state.currentMonth = action.payload;
    },

    setPeriod: (state, action) => {
      const { year, month } = action.payload;
      state.currentYear = year;
      state.currentMonth = month;
    },

    nextMonth: (state) => {
      let month = Number(state.currentMonth);
      let year = Number(state.currentYear);

      if (month === 12) {
        state.currentMonth = "1";
        state.currentYear = (year + 1).toString();
      } else {
        state.currentMonth = (month + 1).toString();
      }
    },

    prevMonth: (state) => {
      let month = Number(state.currentMonth);
      let year = Number(state.currentYear);

      if (month === 1) {
        state.currentMonth = "12";
        state.currentYear = (year - 1).toString();
      } else {
        state.currentMonth = (month - 1).toString();
      }
    },
  },
});

export const { setYear, setMonth, setPeriod, nextMonth, prevMonth } =
  appSlice.actions;

export default appSlice.reducer;
