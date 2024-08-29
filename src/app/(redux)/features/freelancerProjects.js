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
  fetched : false
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (freelancerId, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if(projects.fetched == false){
      try {
        //console.log(projects.fetched, "From Inside API calling");
        const apiUrl = `/api/projects/Project?freelancerId=${freelancerId}`;
        const response = await axios.get(apiUrl);
        console.log("API Called");
        if (response.data.empty) {
          //console.log(response.data.empty, "From Inside API calling, No projects exists");
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
  name: 'freelancerProjects',
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
        state.fetched = true;
        const fetched = state.fetched;
        //console.log(projectsData, "From Inside Fulfilled state")
        if (fetched) {
          state.projects = projectsData;
          //console.log(projectsData, "From Inside Fulfilled state, No projects Exist")
          state.status = 'succeeded';
          //console.log(state.fetched, "From Inside Fulfilled state, No projects Exist");   
          // break;
        }else{
          //console.log(projectsData, "From Inside Fulfilled state,  Projects Exist")
          state.projects = projectsData;
          const completed = projectsData.filter(project => project.status === "Completed");
          const ongoing = projectsData.filter(project => project.status === "In Progress");
          state.completed = completed;
          state.ongoing = ongoing;
          state.allProjects = projectsData.length;
          state.completedProjects = completed.length;
          state.ongoingProjects = ongoing.length;
          state.status = 'succeeded';
          //console.log(state.fetched, "From Inside Fulfilled state, No projects Exist");
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default projects.reducer;
