import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  searchData: [],
  error: null,
};

export const fetchData = createAsyncThunk(
  'search/fetchData',
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/tapesearch/tapesearch/search`, searchData);
      return response.data;
    } catch (error) {
      // Use rejectWithValue to pass a custom error payload
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.searchData = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export default searchSlice.reducer;
