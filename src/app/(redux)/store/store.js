import { configureStore } from '@reduxjs/toolkit'
import projectDataReducer from '../features/projectDataSlice'
import freelancerProjects from "../features/freelancerProjects"

const store = configureStore({
  reducer: {
    projects : projectDataReducer,
    freelancer : freelancerProjects
  }
})

export default store;