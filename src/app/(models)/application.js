const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ApplicationSchema = new Schema({
  clientId: { type: String, required: true },              
  message: { type: String, trim: true, maxlength: 2000 },                          
  freelancer: {
    id: String,
    fullname: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true },
    professionalTitle: { type: String, trim: true, maxlength: 120 },
    skill: [{ type: String, trim: true, maxlength: 60 }],
    imageLink: { type: String, trim: true, default: "" }
  },
  project: {
    id: String,
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    budget: { type: Number },
    status: { type: String }
  },
  applicationStatus: {
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'pending', 'accepted', 'rejected'], 
    default: 'Pending'
  }
}, {
  timestamps: true                                        
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default Application;

