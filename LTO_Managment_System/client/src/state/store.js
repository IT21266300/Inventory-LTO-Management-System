import { configureStore } from '@reduxjs/toolkit';
import SearchReducer from './searchSlicer';

export const store = configureStore({
  reducer: {
    searchData: SearchReducer
  },
});
