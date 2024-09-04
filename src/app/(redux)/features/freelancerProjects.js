import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  freelancerprojects: [],
  freelancerOngoingProjects: [],
  freelancerCompletedProjects: [],
  CompletedProjects: 0,
  OngoingProjects: 0,
  allFreelancerProjects: 0,
  status: 'idle',
  error: null,
  fetched : false,
  empty : false,
  projects : [],
  filteredProjects : [],
  projectsFetched : false
};

export const fetchFreelancerProjects = createAsyncThunk(
  'projects/fetchFreelancerProjects',
  async (freelancerId, { getState, rejectWithValue }) => {
    const { freelancer } = getState();
    if(!(freelancer.fetched)){
      try {
        const apiUrl = `/api/projects/Freelancer?freelancerId=${freelancerId}`;
        const response = await axios.get(apiUrl);
        // console.log("API Called");
        if (response.data.empty) {
          // console.log(response.data.empty, "From Inside API calling, No projects created yet");
          return response.data.empty;
        } else {
          // console.log(response.data.data, "From Inside API calling, Printing Projects,Projects Exists");
          return response.data.data;
        }
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
    }
    
);

//Calling API to fetch the projects data from the database
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if (!(freelancer.projectsFetched)) {
      try {
        console.log("API called to fetch projects for fl page")
        const apiUrl = `/api/projects/Project`;
        const response = await axios.get(apiUrl);
        console.log(response.data);
        if (response.data.empty) {
          return response.data.empty;
        } else {
          return response.data.data;
        }
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  }

);


const freelancer = createSlice({
  name: 'freelancer',
  initialState,
  reducers: {
    filterByBudget: (state, action) => {
      state.filteredProjects = state.projects.filter((freelancer) => freelancer.budget <= action.payload);
    },
    filterByCategory: (state, action) => {
      state.filteredProjects = state.projects.filter((freelancer) => freelancer.projectCategory === action.payload);
    },
    filterBySearch: (state, action) => {
      state.filteredProjects = state.projects.filter(freelancer =>
        freelancer.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFreelancerProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFreelancerProjects.fulfilled, (state, action) => {
        const freelancer = action.payload;
        if(Array.isArray(freelancer)){
          state.freelancerprojects = freelancer;
          const completed = freelancer.filter(project => project.status === "Completed");
          const ongoing = freelancer.filter(project => project.status === "In Progress");
          state.freelancerCompletedProjects = completed;
          state.freelancerOngoingProjects = ongoing;
          state.allFreelancerProjects = freelancer.length;
          state.CompletedProjects = completed.length;
          state.OngoingProjects = ongoing.length;
          state.fetched = true;
          state.status = 'succeeded';
        }else{
          state.status = 'succeeded';
          state.empty = true;
          state.fetched = true;
        }
        })
      .addCase(fetchFreelancerProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.rejected, (state,action)=> {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProjects.fulfilled, (state,action) =>{
        const projectsData = action.payload;
        if (Array.isArray(projectsData)) {
          //console.log(projectsData, "Inside Fulfilled State, Array");
          state.projects = projectsData;
          state.filteredProjects = projectsData;
          state.status = 'succeeded';
          state.empty = true;
          state.projectsFetched = true;
        }else{
          console.log(projectsData, "Inside Fulfilled State, Not an Array");
          state.status = 'succeeded';
          state.empty = true;
          state.projectsFetched = true;
        }
      })
  },
});

export  const {filterByBudget, filterByCategory, filterBySearch} = freelancer.actions;

export default freelancer.reducer;
