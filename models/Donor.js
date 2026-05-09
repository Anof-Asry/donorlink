import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Donor Name is required"],
        trim: true
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age must be at least 18 years old"],
        max: [65, "Age must be less than 65 years old"]
    },
    contact: {
        type: String,
        required: [true, "Contact number is required"]
    },
    city:{
        type: String,
        required: [true, "City is required"]
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    lastDonated: {
        type: Date,
        default: null
    }
},{timestamps: true});


export default mongoose.model("Donor",donorSchema);
