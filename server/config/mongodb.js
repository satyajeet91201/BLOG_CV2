import mongoose  from "mongoose";


const connectDB = async ()=>{

    mongoose.connection.on('connected',()=>{
        console.log("Connecting to MongoDB with URL:", process.env.MONGODB_URL);
        console.log("Database connected")
    });
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
}

export default connectDB;

console.log("Connecting to MongoDB with URL:", process.env.MONGODB_URL);
