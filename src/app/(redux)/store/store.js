import { configureStore } from '@reduxjs/toolkit'
import projectDataReducer from '../features/projectDataSlice'

const store = configureStore({
  reducer: {
    projects : projectDataReducer
  }
})

export default store;