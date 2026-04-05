require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/user.routes")

const app = express();
connectDB();

app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);



const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`app is running in port ${PORT}`);
})