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
  freelancerName:{type:String},
  clientName : {type: String},
  clientImageLink : {type : String, default: ""},
  applied : [String],
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  coordinates: {
    latitude:  { type: Number ,default: null },
    longitude: { type: Number ,default: null },
  },
  milestones: [{ 
    title: { type: String },
    description: { type: String },
    amount: { type: String }, 
    status: { type: String, enum: ['Not Applied', 'Pending Approval', 'Approved'], default: 'Not Applied' },
    statusDate:{type:Date, default: null},
    paymentStatus:{ type: String, enum: ['Pending', 'Completed'], default: 'Pending' }, 
    paymentDate:{type:Date, default: null},
    message:{type:String, default:""}

  }]
  
},{
  timestamps: true,
});

const Project = mongoose.models.Project|| mongoose.model('Project', ProjectSchema);

export default Project;