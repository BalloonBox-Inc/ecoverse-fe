import { createSlice } from '@reduxjs/toolkit';

export type PurchaseState = {
  isPurchasing: boolean;
};

const initialState: PurchaseState = {
  isPurchasing: false,
};

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {},
});

export const {} = purchaseSlice.actions;

export default purchaseSlice.reducer;
