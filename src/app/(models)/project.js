const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const ProjectSchema = new Schema({
  title: { type: String },
  description: { type: String },
  budget: { type: Number },
  technologies: [{ type: String }],
  deadline: { type: Number },
  projectCategory : { type: String },
  clientId :{type:String} ,
  freelancerId:{type:String,default:"none"},
  clientName : {type: String},
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
},{
  timestamps: true,
});

const Project = mongoose.models.Project|| mongoose.model('Project', ProjectSchema);

export default Project;