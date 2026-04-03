const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();

const app = express();
connectDB();


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`app is running in port ${PORT}`);
})