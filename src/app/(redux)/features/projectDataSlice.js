import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    projects : [],
    ongoing : [],
    completed : [],
    completedProjects : 0,
    ongoingProjects : 0,
    allProjects : 0    
}

const projects = createSlice({
    name : "data",
    initialState,
    reducers: {
        setProjects : (state, action) =>{
            state.projects = action.payload
        },
        setOngoing : (state, action)=>{
            state.ongoing = action.payload;
        },
        setCompleted : (state, action)=>{
            state.completed = action.payload;
        },
        setAllProjects : (state, action)=>{
            state.allProjects = action.payload;
        },
        setCompletedProjects : (state, action)=>{
            state.completedProjects = action.payload;
        },
        setOngoingProjects : (state, action)=>{
            state.ongoingProjects = action.payload;
        }
    }
})

export const {setProjects, setOngoing,setCompleted,setAllProjects,setOngoingProjects,setCompletedProjects}  = projects.actions;
export default projects.reducer;
