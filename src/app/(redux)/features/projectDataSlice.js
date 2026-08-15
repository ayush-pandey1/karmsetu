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
  freelancerDetailsFetched: false,
  refresh: false,
  filters: {
    search: '',
    category: 'all',
    rating: 'all',
  },
};

// Helper function to apply all active filters simultaneously
const applyFilters = (state) => {
  const { search, category, rating } = state.filters;
  const searchLower = (search || '').trim().toLowerCase();

  state.filteredFreelancer = state.freelancer.filter((freelancer) => {
    if (!freelancer) return false;

    // 1. Search filter: search in fullname, professionalTitle, skills, and bio safely
    if (searchLower) {
      const nameMatch = (freelancer.fullname || '').toLowerCase().includes(searchLower);
      const titleMatch = (freelancer.professionalTitle || '').toLowerCase().includes(searchLower);
      const bioMatch = (freelancer.bio || '').toLowerCase().includes(searchLower);
      const skillMatch = Array.isArray(freelancer.skill)
        ? freelancer.skill.some((s) => typeof s === 'string' && s.toLowerCase().includes(searchLower))
        : false;

      if (!nameMatch && !titleMatch && !bioMatch && !skillMatch) {
        return false;
      }
    }

    // 2. Category / Professional Title filter
    if (category && category !== 'all') {
      if (freelancer.professionalTitle !== category) {
        return false;
      }
    }

    // 3. Rating filter
    if (rating && rating !== 'all') {
      const minRating = parseFloat(rating);
      const freelancerRating = parseFloat(freelancer.rating || 0);
      if (isNaN(minRating) || freelancerRating < minRating) {
        return false;
      }
    }

    return true;
  });
};

//Calling API to fetch the projects data from the database
export const fetchClientProjects = createAsyncThunk(
  'projects/fetchClientProjects',
  async (clientId, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if (!projects.fetched || projects.refresh) {
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
  async (force = false, { getState, rejectWithValue }) => {
    const { projects } = getState();
    if (!projects.freelancerDetailsFetched || force || projects.refresh) {
      try {
        const api = `/api/freelancer`;
        const response = await axios.get(api);
        return response.data.freelancers;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    } else {
      return projects.freelancer;
    }
  }
);

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    filterByRating: (state, action) => {
      state.filters.rating = action.payload;
      applyFilters(state);
    },
    filterByCategory: (state, action) => {
      state.filters.category = action.payload;
      applyFilters(state);
    },
    filterBySearch: (state, action) => {
      state.filters.search = action.payload;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: 'all',
        rating: 'all',
      };
      state.filteredFreelancer = state.freelancer;
    },
    modifyRefresh: (state) => {
      state.refresh = true;
      state.freelancerDetailsFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClientProjects.fulfilled, (state, action) => {
        const projectsData = action.payload;
        state.refresh = false;
        if (Array.isArray(projectsData)) {
          state.projects = projectsData;
          state.completed = state.projects.filter((project) => project.status === 'Completed');
          state.ongoing = state.projects.filter((project) => project.status === 'In Progress');
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
      .addCase(fetchClientProjects.rejected, (state, action) => {
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
          state.freelancerDetailsFetched = true;
          state.status = 'succeeded';
          applyFilters(state);
        }
      })
      .addCase(freelancerDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { filterByRating, filterByCategory, filterBySearch, resetFilters, modifyRefresh } = projects.actions;
export default projects.reducer;
