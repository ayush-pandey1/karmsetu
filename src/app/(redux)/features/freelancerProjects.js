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
  empty : false
};

export const fetchFreelancerProjects = createAsyncThunk(
  'projects/fetchFreelancerProjects',
  async (freelancerId, { getState, rejectWithValue }) => {
    const { freelancer } = getState();
    console.log(freelancer.fetched);
    if(!(freelancer.fetched)){
      try {
        console.log(freelancer.fetched, "From Inside API calling");
        const apiUrl = `/api/projects/Freelancer?freelancerId=${freelancerId}`;
        const response = await axios.get(apiUrl);
        console.log("API Called");
        if (response.data.empty) {
          console.log(response.data.empty, "From Inside API calling, No projects created yet");
          return response.data.empty;
        } else {
          console.log(response.data.data, "From Inside API calling, Printing Projects,Projects Exists");
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
      });
  },
});

export default freelancer.reducer;
