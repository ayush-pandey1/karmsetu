import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

const userSchema = new Schema({
    fullname: { type: String, trim: true, maxlength: 120 },
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        trim: true, 
        lowercase: true,
        maxlength: 254 
    }, 
    password: { type: String, default: null },
    phone: { 
        type: String, 
        trim: true,
        match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"]
    },  
    age: { 
        type: Number, 
        min: [16, "Age must be at least 16"], 
        max: [100, "Age must be 100 or less"],
        validate: {
            validator: function(v) {
                return v == null || (Number.isInteger(v) && Number.isFinite(v));
            },
            message: "Age must be a whole number"
        }
    }, 
    gender: { type: String, enum: ["male", "female"] }, 
    address: { type: String, trim: true, maxlength: 300 },
    companyName: { type: String, trim: true, maxlength: 120 },
    industry: { type: String, trim: true, maxlength: 120 },
    bio: { type: String, trim: true, minlength: 10, maxlength: 2000 },  
    socialMedia: { type: String, trim: true, maxlength: 500 },
    professionalTitle: { type: String, trim: true, maxlength: 120 },
    skill: [{ type: String, trim: true, maxlength: 60 }], 
    portfolio: { type: String, trim: true, maxlength: 500 }, 
    connection: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5 },
    Cost: { type: Number, min: 0 },
    role: { type: String, enum: ["client", "freelancer"], default: "freelancer" },
    coordinates: {
        latitude:  { type: Number, default: null },
        longitude: { type: Number, default: null },
    },
    imageLink: { type: String, trim: true, default: "" },
    portfolioDetails: [{
        title: { type: String, trim: true, maxlength: 120 },
        description: { type: String, trim: true, maxlength: 2000 },
        imageLink: { type: String, trim: true, default: "" },
        tags: [{ type: String, trim: true, maxlength: 50 }]
    }]
}, {
    timestamps: true,
});

// Set default value after schema definition
userSchema.path('portfolioDetails').set(function(v) {
    return v || [];
});
  
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

