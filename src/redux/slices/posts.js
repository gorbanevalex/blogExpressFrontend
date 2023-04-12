import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("fetch/posts", async (sortBy) => {
  const { data } = await axios.post(`/posts/get`, { sortBy });
  return data;
});

export const fetchTags = createAsyncThunk("fetch/tags", async () => {
  const { data } = await axios.get("/posts/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  commentsSelect: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    removePost: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (post) => post._id !== action.payload
      );
    },
    changeComments: (state, action) => {
      state.commentsSelect = action.payload;
    },
  },
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "errors";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.status = "loaded";
      state.posts.items = action.payload;
    },
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "errors";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
  },
});

export const { removePost, changeComments } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
