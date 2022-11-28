import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileObj, TilesObj } from '@utils/interface/map-interface';

export interface SelectState {
  selectedTiles: TilesObj;
  isSelecting: boolean;
}

const initialState: SelectState = {
  selectedTiles: {},
  isSelecting: false,
};

export const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    setSelectedTiles: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
    },
    clearSelectedTiles: (state) => {
      state.selectedTiles = {};
    },
  },
});

export const { actions } = selectSlice;

export default selectSlice.reducer;
