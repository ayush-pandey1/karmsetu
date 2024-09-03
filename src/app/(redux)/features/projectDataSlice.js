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
  empty: false,
  freelancer: [],
  filteredFreelancer: [],
  freelancerDetailsFetched: false
};

//Calling API to fetch the projects data from the database
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (clientId, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if (!(projects.fetched)) {
      try {
        const apiUrl = `/api/projects/Project?clientId=${clientId}`;
        const response = await axios.get(apiUrl);
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

//Calling API to fetch the freelancers details from the database
export const freelancerDetails = createAsyncThunk(
  'users/freelancer',
  async (_, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if (!(projects.freelancerDetailsFetched)) {
      try {
        const api = `/api/freelancer`;
        const response = await axios.get(api);
        return response.data.freelancers;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    } else {
      return;
    }
  }
)

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    filterByRating: (state, action) => {
      state.filteredFreelancer = state.filteredFreelancer.filter((freelancer) => freelancer.rating >= action.payload);
    },
    filterByBudget: (state, action) => {
      state.filteredFreelancer = state.filteredFreelancer.filter((freelancer) => freelancer.budget <= action.payload);
    },
    filterByCategory: (state, action) => {
      state.filteredFreelancer = state.filteredFreelancer.filter((freelancer) => freelancer.professionalTitle === action.payload);
    },
    filterBySearch: (state, action) => {
      state.filteredFreelancer = state.filteredFreelancer.filter(freelancer =>
        freelancer.fullname.toLowerCase().includes(action.payload.toLowerCase())
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        const projectsData = action.payload;
        if (Array.isArray(projectsData)) {
          state.projects = projectsData;
          state.completed = state.projects.filter(project => project.status === "Completed");
          state.ongoing = state.projects.filter(project => project.status === "In Progress");
          state.allProjects = projectsData.length;
          state.completedProjects = state.completed.length;
          state.ongoingProjects = state.ongoing.length;
          state.fetched = true;
          state.status = 'succeeded';
        } else {
          state.status = 'succeeded';
          state.empty = true;
          state.fetched = true;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(freelancerDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(freelancerDetails.fulfilled, (state, action) => {
        const freelancerData = action.payload;
        if (Array.isArray(freelancerData)) {
          state.freelancer = freelancerData;
          state.filteredFreelancer = freelancerData;
          state.freelancerDetailsFetched = true;
          state.status = 'succeeded'
        }
      })
      .addCase(freelancerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  },
});

export const { filterByRating, filterByBudget, filterByCategory, filterBySearch } = projects.actions;
export default projects.reducer;
