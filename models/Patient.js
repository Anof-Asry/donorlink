import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Patient Name is required"],
        trim: true
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"]
    },
    contact: {
        type: String,
        required: [true, "Contact number is required"]
    },
    hospital:{
        type: String,
        required: [true, "Hospital name is required"]
    },
    reason:{
        type: String,
        required: [true, "Hospital name is required"]
    },
    condition:{
        type: String,
        default: "Stable"
    }
},{timestamps: true});

export default mongoose.model("Patient",patientSchema);