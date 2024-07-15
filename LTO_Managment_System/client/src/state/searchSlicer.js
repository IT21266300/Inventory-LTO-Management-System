import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  searchData: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.searchData = action.payload;
        state.loading = false;
      })
  },
});

export const fetchData = createAsyncThunk(
  'product/fetchSingleProduct',
  async (searchData) => {
    try {
      const response = await axios.post(
        `api/tapesearch/tapesearch/search`,
        {
            data: searchData,
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
);



export default searchSlice.reducer;
