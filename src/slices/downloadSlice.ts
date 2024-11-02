import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type {
  DownloadStart,
  DownloadFinished,
  DownloadProgress,
} from '@/tauri';

interface Download {
  totalSize: number;
  downloaded?: number;
  speed?: number;
  status: 'progress' | 'installing' | 'error';
}

const initialState: { [key: string]: Download } = {};

export const downloadSlice = createSlice({
  name: 'download',
  initialState,
  reducers: {
    setDownloadStart: (state, action: PayloadAction<DownloadStart>) => {
      const { key, totalSize } = action.payload;
      state[key] = {
        status: 'progress',
        totalSize,
      };
    },
    setDownloadProgress: (state, action: PayloadAction<DownloadProgress>) => {
      const { key, downloaded, speed } = action.payload;
      state[key].downloaded = downloaded;
      state[key].speed = speed;
    },
    setDownloadFinished: (state, action: PayloadAction<DownloadFinished>) => {
      const { key } = action.payload;
      state[key].status = 'installing';
    },
    removeDownload: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const {
  setDownloadStart,
  setDownloadProgress,
  setDownloadFinished,
  removeDownload,
} = downloadSlice.actions;
export const getDownloadStatus = (key: string) => (state: RootState) =>
  state.downloads[key];

export default downloadSlice.reducer;
