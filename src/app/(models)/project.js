const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const ProjectSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
  description: { type: String, required: true, trim: true, minlength: 20, maxlength: 5000 },
  budget: { 
    type: Number, 
    required: true,
    min: [1, "Budget must be at least ₹1"],
    max: [100000000, "Budget cannot exceed ₹100,000,000"]
  },
  technologies: [{ type: String, trim: true, maxlength: 60 }],
  deadline: { type: Number },
  duration: { type: String, trim: true, maxlength: 100 },
  projectCategory: { type: String, trim: true, maxlength: 100 },
  clientId: { type: String, required: true },
  freelancerId: { type: String, default: "none" },
  freelancerName: { type: String, trim: true, maxlength: 120 },
  clientName: { type: String, trim: true, maxlength: 120 },
  clientImageLink: { type: String, trim: true, default: "" },
  applied: [String],
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  coordinates: {
    latitude:  { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  milestones: [{ 
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000 },
    amount: { type: String, trim: true }, 
    status: { type: String, enum: ['Not Applied', 'Pending Approval', 'Approved'], default: 'Not Applied' },
    statusDate: { type: Date, default: null },
    paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }, 
    paymentDate: { type: Date, default: null },
    message: { type: String, trim: true, maxlength: 2000, default: "" }
  }]
},{
  timestamps: true,
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;