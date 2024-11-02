import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProjectInfo } from '@/tauri';

export type ModalData =
  | {
      name: 'project-add';
      params: {
        info: ProjectInfo;
      };
    }
  | {
      name: 'project-remove';
      params: {
        info: ProjectInfo;
      };
    }
  | {
      name: 'project-new';
    }
  | {
      name: 'engine-install';
      params: {
        version: string;
        flavor: string;
      };
    }
  | { name: 'assets' }
  | { name: 'documentation' }
  | { name: 'news' }
  | { name: 'downloads' }
  | { name: 'settings' };

interface ModalState {
  show: boolean;
  data?: ModalData;
}

const initialState: ModalState = {
  show: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<ModalData>) => {
      state.show = true;
      state.data = action.payload;
    },
    hideModal: (state) => {
      state.show = false;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;
