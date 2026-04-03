const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);

        if (res) {
            console.log("mongodb connected successfully");
        }
    } catch (error) {
        console.log("error while connecting database :",error);
        
    }
}

module.exports = connectDB;