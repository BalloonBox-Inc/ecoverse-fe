import { RootState } from '@plugins/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalState = {
  modalType: ModalType | undefined;
};

// export type ModalType = keyof typeof MODAL;
export enum ModalType {
  login = 'login',
}

const initialState: ModalState = {
  modalType: undefined,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalType: (state, action: PayloadAction<ModalType>) => {
      state.modalType = action.payload;
    },
    clearModalType: (state) => (state.modalType = undefined),
  },
});

export const { setModalType, clearModalType } = modalSlice.actions;

export default modalSlice.reducer;

export const selectModal = (state: RootState) => state.modal.modalType;
