import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  projects: [],
  ongoing: [],
  completed: [],
  completedProjects: 0,
  ongoingProjects: 0,
  allProjects: 0,
  status: 'idle',
  error: null,
  fetched: false,
  empty: false
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (clientId, { getState, rejectWithValue }) => {
    const { projects } = getState();
    //console.log(projects.fetched, "Before calling the API");
    if (!(projects.fetched)) {
      try {
        //console.log(projects.fetched, "From Inside API calling");
        const apiUrl = `/api/projects/Project?clientId=${clientId}`;
        const response = await axios.get(apiUrl);
        console.log("API Called");
        if (response.data.empty) {
          //console.log(response.data.empty, "From Inside API calling, Printing Response,No Projects Exists");
          return response.data.empty;
        } else {
          //console.log(response.data.data, "From Inside API calling, Printing Projects,Projects Exists");
          return response.data.data;
        }
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  }

);


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
        //console.log(projectsData, "From the fulfilled to check but beforing checking the response is array or not");
        if (Array.isArray(projectsData)) {
          state.projects = projectsData;
          state.completed = state.projects.filter(project => project.status === "Completed");
          state.ongoing = state.projects.filter(project => project.status === "In Progress");
          state.allProjects = projectsData.length;
          state.completedProjects = state.completed.length;
          state.ongoingProjects = state.ongoing.length;
          state.fetched = true;
          state.status = 'succeeded';
          //console.log("Project Exists");
        } else {
          state.status = 'succeeded';
          state.empty = true;
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
