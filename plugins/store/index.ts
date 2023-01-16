import filterReducer from '@plugins/store/slices/filter';
import mapReducer from '@plugins/store/slices/map';
import projectReducer from '@plugins/store/slices/projects';
import purchaseReducer from '@plugins/store/slices/purchase';
import searchReducer from '@plugins/store/slices/search-query';
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    map: mapReducer,
    search: searchReducer,
    project: projectReducer,
    filter: filterReducer,
    purchase: purchaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
