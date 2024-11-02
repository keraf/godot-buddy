import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Engine, Version } from '@/tauri';
import { RootState } from '@/store';

interface VersionState {
  installed: Engine[];
  available: Version[];
}

const initialState: VersionState = {
  installed: [],
  available: [],
};

export const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {
    setAvailableVersions: (state, action: PayloadAction<Version[]>) => {
      state.available = action.payload
        // Filter out version 1.x and 2.x for now
        .filter((v) => !v.name.startsWith('1.') && !v.name.startsWith('2.'));
    },
    setInstalledVersions: (state, action: PayloadAction<Engine[]>) => {
      state.installed = action.payload;
    },
    addInstalledVersion: (state, action: PayloadAction<Engine>) => {
      state.installed.push(action.payload);
    },
    removeInstalledVersion: (state, action: PayloadAction<String>) => {
      state.installed = state.installed.filter((i) => i.key !== action.payload);
    },
  },
});

export const {
  setAvailableVersions,
  setInstalledVersions,
  addInstalledVersion,
  removeInstalledVersion,
} = versionSlice.actions;
export const getEngineInfo = (key: string) => (state: RootState) => {
  const info = state.versions.available.find((a) => a.key === key);
  const isInstalled =
    state.versions.installed.findIndex((i) => i.key === key) > -1;

  return { ...info, isInstalled };
};
export default versionSlice.reducer;
