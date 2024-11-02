import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/core';
import { startAppListening } from '@/middlewares/listenerMiddleware';
export type Settings = { [key: string]: string };

export const versionSlice = createSlice({
  name: 'version',
  initialState: {} as Settings,
  reducers: {
    setInitialSettings: (_, { payload }: PayloadAction<Settings>) => {
      return payload;
    },
    setSetting: (
      state,
      { payload }: PayloadAction<{ key: string; value: string }>
    ) => {
      state[payload.key] = payload.value;
    },
  },
});

export const { setInitialSettings, setSetting } = versionSlice.actions;

startAppListening({
  matcher: isAnyOf(setSetting),
  effect: async (_, listenerApi) => {
    const { settings } = listenerApi.getState();
    invoke<Settings>('settings_set', { settings });
  },
});

export default versionSlice.reducer;
