import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;

export const selectQuery = (state: RootState) => state.search.query;
