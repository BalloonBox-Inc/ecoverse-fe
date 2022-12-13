import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterParams {
  country?: string;
  resource?: string;
  status?: string;
  minSize?: number;
  maxSize?: number;
  certifiedFSC?: boolean;
  search?: string;
}

export type Filter = keyof FilterParams;

const initialState: FilterParams = {
  country: undefined,
  resource: undefined,
  status: undefined,
  minSize: undefined,
  maxSize: undefined,
  certifiedFSC: undefined,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<string | undefined>) => {
      state.country = action.payload;
    },
    setResource: (state, action: PayloadAction<string | undefined>) => {
      state.resource = action.payload;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      state.status = action.payload;
    },
    setCertifiedFSC: (state, action: PayloadAction<boolean | undefined>) => {
      state.certifiedFSC = action.payload;
    },
    unsetFilter: (state, action: PayloadAction<Filter>) => {
      state[action.payload] = undefined;
    },
  },
});

export const {
  setCountry,
  setResource,
  setStatus,
  setCertifiedFSC,
  unsetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;

export const selectCountry = (state: RootState) => state.filter.country;

export const selectResource = (state: RootState) => state.filter.resource;

export const selectStatus = (state: RootState) => state.filter.status;

export const selectCertifiedFSC = (state: RootState) =>
  state.filter.certifiedFSC;

export const selectFilters = (state: RootState) => state.filter;
