import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    fullname: String,
    email: { type: String, unique: true }, 
    password: String,
    phone: String,  
    age: Number, 
    gender: { type: String, enum: ["male", "female"] }, 
    address: String,
    companyName: String,
    industry: String,
    bio: { type: String, minlength: 10 },  
    socialMedia: String,
    professionalTitle: String,
    skill: [String], 
    portfolio: String, 
    connection: {type:Number},
    role: { type: String, default: "freelancer" },
    coordinates: {
        latitude:  { type: Number ,default: null },
        longitude: { type: Number ,default: null },
      }
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
