import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export type Route =
  | { page: 'projects' }
  | {
      page: 'versions';
      params: {
        tab: 'installed' | 'available';
      };
    }
  | { page: 'assets' }
  | { page: 'documentation' }
  | { page: 'news' }
  | { page: 'downloads' }
  | { page: 'settings' };

interface RouterState {
  previous?: Route;
  current: Route;
}

const initialState: RouterState = {
  current: {
    // page: 'projects',
    page: 'versions',
    params: {
      tab: 'installed',
    },
  },
};

export const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<Route>) => {
      state.previous = state.current;
      state.current = action.payload;
    },
    back: (state) => {
      state.current = state.previous ?? initialState.current;
      delete state.previous;
    },
  },
});

export const { navigate, back } = routerSlice.actions;
export const currentPage = (state: RootState) => state.router.current.page;

export default routerSlice.reducer;
