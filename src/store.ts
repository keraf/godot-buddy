import { configureStore } from '@reduxjs/toolkit';

import downloadSlice from './slices/downloadSlice';
import modalSlice from './slices/modalSlice';
import projectsSlice from './slices/projectSlice';
import routerSlice from './slices/routerSlice';
import settingSlice from './slices/settingSlice';
import versionsSlice from './slices/versionSlice';

import { listenerMiddleware } from './middlewares/listenerMiddleware';
import './middlewares/loggerMiddleware';

export const store = configureStore({
  reducer: {
    downloads: downloadSlice,
    modals: modalSlice,
    projects: projectsSlice,
    router: routerSlice,
    versions: versionsSlice,
    settings: settingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
