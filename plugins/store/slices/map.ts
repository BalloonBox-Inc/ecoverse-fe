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
    startSelecting: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
      state.isSelecting = true;
    },
    finishSelecting: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
      state.isSelecting = false;
    },
    setSelectedTile: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
    },
    removeSelectedTile: (state, action: PayloadAction<TileObj>) => {
      if (state.selectedTiles[action.payload.id]) {
        delete state.selectedTiles[action.payload.id];
      }
    },
    clearSelectedTiles: (state) => {
      state.selectedTiles = {};
    },
  },
});

export const {
  setTiles,
  setArea,
  startSelecting,
  finishSelecting,
  setSelectedTile,
  removeSelectedTile,
  clearSelectedTiles,
} = mapSlice.actions;

export default mapSlice.reducer;

export const selectTiles = (state: RootState) => state.map.tiles;
export const selectSelectedTiles = (state: RootState) =>
  state.map.selectedTiles;
export const selectIsSelecting = (state: RootState) => state.map.isSelecting;
