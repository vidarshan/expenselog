import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { notifications } from "@mantine/notifications";
import classes from "../../Demo.module.css";

const initialState = {
  categories: [],
  loading: false,
  error: "",
};

export const getCategories = createAsyncThunk(
  "categories/get",
  async (_, thunkAPI) => {
    try {
      const categoryRes = await api.get("/categories");
      const categoryData = categoryRes.data;

      return categoryData;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Fetch failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/categories", payload);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Create failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, name, color }, thunkAPI) => {
    try {
      const res = await api.patch(`/categories/${id}`, { name, color });
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Update failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Delete failed";
      return thunkAPI.rejectWithValue(msg);
    }
  },
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const created = action.payload;
        state.categories = [created, ...(state.categories || [])];
        notifications.show({
          title: "Category created",
          classNames: classes,
        });
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Create failed";
        notifications.show({
          title: "Category creation failed",
          classNames: classes,
          color: "red",
        });
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const updated = action.payload;
        state.categories = (state.categories || []).map((t) =>
          t._id === updated._id ? updated : t,
        );
        notifications.show({
          title: "Updated category",
          classNames: classes,
        });
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
        notifications.show({
          title: "Category update failed",
          classNames: classes,
          color: "red",
        });
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const id = action.payload;
        state.categories = (state.categories || []).filter((t) => t._id !== id);
        notifications.show({
          title: "Category Deleted",
          classNames: classes,
        });
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
        notifications.show({
          title: "Category deletion failed",
          classNames: classes,
          color: "red",
        });
      });
  },
});

export default categoriesSlice.reducer;
