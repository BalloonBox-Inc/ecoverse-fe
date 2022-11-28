import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileAreaObj, TileObj, TilesObj } from '@utils/interface/map-interface';

export interface MapState {
  tiles: TilesObj;
  areas: TileAreaObj;
  selectedTiles: TilesObj;
  isSelecting: boolean;
}

const initialState: MapState = {
  tiles: {},
  areas: {},
  selectedTiles: {},
  isSelecting: false,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setTiles: (state, action: PayloadAction<TilesObj>) => {
      state.tiles = action.payload;
    },
    setArea: (state, action: PayloadAction<TileAreaObj>) => {
      state.areas = action.payload;
    },
    setSelectedTiles: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
    },
    clearSelectedTiles: (state) => {
      state.selectedTiles = {};
    },
    setIsSelecting: (state, action: PayloadAction<boolean>) => {
      state.isSelecting = action.payload;
    },
  },
});

export const {
  setTiles,
  setArea,
  setSelectedTiles,
  clearSelectedTiles,
  setIsSelecting,
} = mapSlice.actions;

export default mapSlice.reducer;

export const selectTiles = (state: RootState) => state.map.tiles;
