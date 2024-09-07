const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ApplicationSchema = new Schema({
  clientId: { type: String, required: true },              
  message: { type: String },                          
  freelancer: {
    id:String,
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    professionalTitle: { type: String },
    skill: { type: [String] },
    imageLink : {type : String}
  },
  project: {
    id:String,
    title: { type: String, required: true },
    description: { type: String },
    budget: { type: Number },
    status: { type: String }
  },
  applicationStatus : {type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending'}
}, {
  timestamps: true                                        
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default Application;
