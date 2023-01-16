import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TileObj } from '@utils/interface/map-interface';

export type PurchaseState = {
  isPurchasing: boolean;
  tilesToPurchase: TileObj[];
};

const initialState: PurchaseState = {
  isPurchasing: false,
  tilesToPurchase: [],
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    startPurchasing: (state) => {
      state.isPurchasing = true;
    },
    stopPurchasing: (state) => {
      state.isPurchasing = false;
    },
    setIsPurchasing: (state, action: PayloadAction<boolean>) => {
      state.isPurchasing = action.payload;
    },
    setTilesToPurchase: (state, action: PayloadAction<TileObj[]>) => {
      state.tilesToPurchase = action.payload;
    },
    clearTilesToPurchase: (state) => {
      state.tilesToPurchase = [];
    },
  },
});

export const { startPurchasing, stopPurchasing, setTilesToPurchase } =
  purchaseSlice.actions;

export default purchaseSlice.reducer;

export const selectIsPurchasing = (state: RootState) =>
  state.purchase.isPurchasing;

export const selectTilesToPurchase = (state: RootState) =>
  state.purchase.tilesToPurchase;
