import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Center } from '@services/map';
import { TileObj } from '@utils/interface/map-interface';
import * as mapUtils from '@utils/map-utils';

export type PurchaseState = {
  tilesToPurchase: TileObj[];
  filledArea: number | undefined;
  areaName: string;
  center: Center | undefined;
};

const initialState: PurchaseState = {
  tilesToPurchase: [],
  filledArea: undefined,
  areaName: '',
  center: undefined,
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setTilesToPurchase: (state, action: PayloadAction<TileObj[]>) => {
      state.tilesToPurchase = action.payload;
      const polygon = mapUtils.getPolygonFromTiles(action.payload);
      state.center = mapUtils.getCenterCoordsFromPolygon(polygon);
      state.filledArea = mapUtils.getAreaFromPolygon(polygon);
    },
    clearTilesToPurchase: (state) => {
      state.tilesToPurchase = [];
      state.center = undefined;
      state.areaName = '';
      state.filledArea = undefined;
    },
    setAreaName: (state, action) => {
      state.areaName = action.payload;
    },
  },
});

export const { setTilesToPurchase, clearTilesToPurchase, setAreaName } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;

export const selectTilesToPurchaseDetails = (state: RootState) => ({
  areaName: state.purchase.areaName,
  tiles: state.purchase.tilesToPurchase,
  center: state.purchase.center,
});

export const selectTilesToPurchase = (state: RootState) =>
  state.purchase.tilesToPurchase;

export const selectHasPendingPurchase = (state: RootState) =>
  state.purchase.tilesToPurchase.length;
