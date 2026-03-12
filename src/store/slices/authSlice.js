import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

const initialState = {
  user: {
    token: localStorage.getItem("expenselog-token"),
    username: "",
    salary: {
      fixed: { amount: 0 },
      type: "fixed",
      variable: [],
    },
  },
  loading: false,
  error: "",
};

export const updateUser = createAsyncThunk(
  "auth/update",
  async (payload, thunkAPI) => {
    try {
      const res = await api.patch("/auth/update", payload);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Update failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const loginRes = await api.post("auth/login", { email, password });
      const token = loginRes.data?.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Missing token from login response");
      }

      localStorage.setItem("expenselog-token", token);

      const meRes = await api.get("/auth/me");

      return { token, user: meRes.data };
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Login failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password, name, salary }, thunkAPI) => {
    try {
      await api.post("auth/register", { email, password, name, salary });

      const loginRes = await api.post("auth/login", { email, password });
      const token = loginRes.data?.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Missing token from login response");
      }

      localStorage.setItem("expenselog-token", token);

      const meRes = await api.get("/auth/me");

      return { token, user: meRes.data };
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const getUser = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || "Failed to fetch user";
    return thunkAPI.rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem("expenselog-token");
      return {
        ...initialState,
        user: {
          ...initialState.user,
          token: null,
        },
        loading: false,
        error: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user.token = action.payload.token;
        state.user.username = action.payload.user?.username || "";
        state.user.salary =
          action.payload.user?.salary || initialState.user.salary;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        notifications.show({
          title: "Login failed",
          classNames: classes,
          color: "red",
        });
      })

      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user.token = action.payload.token;
        state.user.username = action.payload.user?.username || "";
        state.user.salary =
          action.payload.user?.salary || initialState.user.salary;
        notifications.show({
          title: "You've been signed up",
          classNames: classes,
        });
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        notifications.show({
          title: "Signup failed",
          classNames: classes,
          color: "red",
        });
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user.email = action.payload.email || "";
        state.user.username = action.payload.username || "";
        state.user.role = action.payload.role || "";
        state.user.salary = action.payload.salary || initialState.user.salary;
        notifications.show({
          title: "Profile Updated",
          classNames: classes,
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
        notifications.show({
          title: "Profile update failed",
          classNames: classes,
          color: "red",
        });
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user.email = action.payload.email || "";
        state.user.username = action.payload?.username || "";
        state.user.salary = action.payload?.salary || initialState.user.salary;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
