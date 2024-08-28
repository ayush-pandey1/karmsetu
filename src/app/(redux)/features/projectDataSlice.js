import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (clientId, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if(!projects.fetched){
      try {
        const apiUrl = `/api/projects/Project?clientId=${clientId}`;
        const response = await axios.get(apiUrl);
        if (response.data.empty) {
          return "No data"
        } else {
          return response.data.data;
        }
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
    }
    
);

const initialState = {
  projects: [],
  ongoing: [],
  completed: [],
  completedProjects: 0,
  ongoingProjects: 0,
  allProjects: 0,
  status: 'idle',
  error: null,
  fetched : false
};

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const projectsData = action.payload;
        if (projectsData !== "No data") {
          const completed = projectsData.filter(project => project.status === "Completed");
          const ongoing = projectsData.filter(project => project.status === "In Progress");
          state.projects = projectsData;
          state.completed = completed;
          state.ongoing = ongoing;
          state.allProjects = projectsData.length;
          state.completedProjects = completed.length;
          state.ongoingProjects = ongoing.length;
          state.status = 'succeeded';
          state.fetched = true;
        }else{
          state.status = 'succeeded';
          state.fetched = true;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default projects.reducer;
