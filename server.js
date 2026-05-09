import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const donorRoutes =  require("./routes/donorRoutes");
const patientRoutes =  require("./routes/patientRoutes");
const requestRoutes =  require("./routes/requestRoutes");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

app.use("/api/donors", donorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => {
    res.json({message: "Welcome to the DonorLink API"});
});

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message);
});
