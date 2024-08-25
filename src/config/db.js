import mongoose from "mongoose";

export async function connect(){
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/KarmSetu");
        const connection = mongoose.connection;

        connection.on("connected", ()=> {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err)=> {
            console.log("MongoDB connection error", err.message);
        });
    } catch (error) {
        console.log(error.message);
    }
}