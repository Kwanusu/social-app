// src/store/socialSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch and transform data
export const fetchSocialData = createAsyncThunk('social/fetchData', async () => {
  const response = await fetch('https://fakestoreapi.com/products?limit=10');
  const data = await response.json();
  
  // Transform "Store" data into "Social" data
  return data.map(item => ({
    id: item.id,
    user: `User_${item.id}`,
    avatar: `https://i.pravatar.cc/150?u=${item.id}`,
    content: item.description,
    image: item.image,
    likes: Math.floor(item.price * 5),
    comments: item.rating.count,
    sentiment: item.rating.rate
  }));
});

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialData.pending, (state) => { state.loading = true; })
      .addCase(fetchSocialData.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchSocialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default socialSlice.reducer;