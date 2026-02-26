import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axios";

const initialState = {
  user: {
    token: localStorage.getItem("expenselog-token"),
    username: "",
    salary: {
      fixed: {
        amount: 0,
      },
      type: "fixed",
      variable: [],
    },
  },
  loading: false,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const response = await axios.post(`/api/auth/login`, {
      email,
      password,
    });

    // "salary": {
    //     "fixed": {
    //         "amount": 60000
    //     },
    //     "type": "fixed",
    //     "variable": []
    // },
    // "_id": "697309ca23af00f4b2ce63ca",
    // "email": "test@expenselog.com",
    // "username": "test user",
    // "role": "user",

    console.log(response);
    return response.data;
  },
);

export const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }) => {
    const response = await axios.post(`/api/auth/login`, {
      email,
      password,
    });
    console.log(response);
    return response.data;
  },
);

export const getUser = createAsyncThunk("auth/me", async () => {
  const response = await api.get("/auth/me");
  console.log(response);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("expenselog-token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.user.token = action.payload.token;
        state.loading = false;
        localStorage.setItem("expenselog-token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        console.log(action);
        state.user.salary = action.payload.salary;
        state.user.username = action.payload.username;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.error = "Login failed";
      });
  },
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
