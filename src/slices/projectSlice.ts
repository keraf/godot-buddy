import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Project } from '@/tauri';

const initialState: Project[] = [];

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (_, action: PayloadAction<Project[]>) => {
      return action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.push(action.payload);
    },
    removeProject: (state, action: PayloadAction<String>) => {
      return state.filter((p) => p.path !== action.payload);
    },
  },
});

export const { setProjects, addProject, removeProject } = projectSlice.actions;
export default projectSlice.reducer;
