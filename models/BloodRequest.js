import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: [true, "Patient is required"]
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        default: null
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    units: {
        type: Number,
        required: [true, "Number of units is required"]
    },
    urgency: {
        type: String,
        default: "Medium",
        enum: ["Low", "Medium", "High","Critical"]
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Matched","Fulfilled", "Cancelled"]
    },
    hospital:{
        type:String,
        required:[true,"Hospital is required"]
    }
},{timestamps: true});

export default mongoose.model("BloodRequest",bloodRequestSchema);