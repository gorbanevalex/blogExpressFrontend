import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("fetch/userData", async (params) => {
  const { data } = await axios.post("/user/login", params);
  return data;
});

export const fetchAuthMe = createAsyncThunk("fetch/authMe", async () => {
  const { data } = await axios.get("/user/me");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
    login: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuth.rejected]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = "loading";
    },
    [fetchAuthMe.rejected]: (state) => {
      state.data = null;
      state.status = "errors";
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "loaded";
    },
  },
});

export const { logout, login } = authSlice.actions;

export const isAuthCheck = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;
