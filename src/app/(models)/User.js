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
    role: { type: String, default: "freelancer" },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
