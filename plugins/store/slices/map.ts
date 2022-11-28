import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileAreaObj, TilesObj } from '@utils/interface/map-interface';

export interface MapState {
  tiles: TilesObj;
  areas: {
    [id: number]: TilesObj;
  };
}

const initialState: MapState = {
  tiles: {},
  areas: {},
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
  },
});

export const { actions } = mapSlice;

export default mapSlice.reducer;
