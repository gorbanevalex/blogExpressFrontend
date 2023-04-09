import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("fetch/userData", async (params) => {
  const { data } = await axios.post("/user/login", params);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
  },
});

export const authReducer = authSlice.reducer;
