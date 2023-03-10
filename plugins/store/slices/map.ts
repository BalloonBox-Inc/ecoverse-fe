import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileAreaObj, TileObj, TilesObj } from '@utils/interface/map-interface';

export interface MapState {
  tiles: TilesObj;
  areas: TileAreaObj;
  selectedTiles: TilesObj;
  selectedArea: TilesObj;
  batchTiles: TilesObj;
  isSelecting: boolean;
  isSelectingArea: boolean;
  isRemoving: boolean;
  fillBatch: boolean;
}

const initialState: MapState = {
  tiles: {},
  areas: {},
  selectedTiles: {},
  selectedArea: {},
  batchTiles: {},
  isSelecting: false,
  isSelectingArea: false,
  isRemoving: false,
  fillBatch: false,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setTiles: (state, action: PayloadAction<TilesObj>) => {
      state.tiles = action.payload;
    },
    updateTiles: (state, action: PayloadAction<TilesObj>) => {
      state.tiles = { ...state.tiles, ...action.payload };
    },
    setArea: (state, action: PayloadAction<TileAreaObj>) => {
      state.areas = action.payload;
    },
    startSelecting: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
      state.batchTiles[action.payload.id] = action.payload;
      state.isSelecting = true;
    },
    finishSelecting: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
      state.batchTiles[action.payload.id] = action.payload;
      state.isSelecting = false;
    },
    setSelectedTile: (state, action: PayloadAction<TileObj>) => {
      state.selectedTiles[action.payload.id] = action.payload;
      state.batchTiles[action.payload.id] = action.payload;
    },
    removeSelectedTile: (state, action: PayloadAction<TileObj>) => {
      if (state.selectedTiles[action.payload.id]) {
        state.isRemoving = true;
        delete state.selectedTiles[action.payload.id];
        delete state.batchTiles[action.payload.id];
      }
    },
    setSelectedTiles: (state, action: PayloadAction<TilesObj>) => {
      state.selectedTiles = action.payload;
    },
    setBatchSelect: (state, action: PayloadAction<TileObj[]>) => {
      action.payload.forEach((tile) => {
        state.selectedTiles[tile.id] = tile;
      });
      state.batchTiles = {};
      state.fillBatch = true;
    },
    clearSelectedTiles: (state) => {
      state.isRemoving = true;
      state.selectedTiles = {};
      state.batchTiles = {};
    },
    stopSelecting: (state) => {
      state.isSelecting = false;
    },
    finishRemoving: (state) => {
      state.isRemoving = false;
    },
    stopFillBatch: (state) => {
      state.fillBatch = false;
    },
    startSelectingArea: (state, action: PayloadAction<keyof TileAreaObj>) => {
      state.isSelectingArea = true;
      state.selectedArea = state.areas[action.payload];
    },
    finishSelectingArea: (state) => {
      state.isSelectingArea = false;
    },
    clearSelectedArea: (state) => {
      state.selectedArea = {};
      state.isRemoving = true;
    },
  },
});

export const {
  setTiles,
  updateTiles,
  setArea,
  startSelecting,
  finishSelecting,
  setSelectedTile,
  removeSelectedTile,
  clearSelectedTiles,
  stopSelecting,
  finishRemoving,
  setBatchSelect,
  stopFillBatch,
  setSelectedTiles,
  startSelectingArea,
  finishSelectingArea,
  clearSelectedArea,
} = mapSlice.actions;

export default mapSlice.reducer;

export const selectTiles = (state: RootState) => state.map.tiles;
export const selectSelectedTiles = (state: RootState) =>
  state.map.selectedTiles;
export const selectIsSelecting = (state: RootState) => state.map.isSelecting;
export const selectIsRemoving = (state: RootState) => state.map.isRemoving;
export const selectHasSelectedTiles = (state: RootState) =>
  !!Object.values(state.map.selectedTiles).length;
export const selectBatchTiles = (state: RootState) => state.map.batchTiles;
export const selectFillBatch = (state: RootState) => state.map.fillBatch;
export const selectAreaTiles = (state: RootState) =>
  Object.values(state.map.areas).reduce((acc, tiles) => {
    return { ...acc, ...tiles };
  }, {});
export const selectSelectedArea = (state: RootState) => state.map.selectedArea;
export const selectIsSelectingArea = (state: RootState) =>
  state.map.isSelectingArea;
export const selectHasSelectedArea = (state: RootState) =>
  !!Object.values(state.map.selectedArea).length;
