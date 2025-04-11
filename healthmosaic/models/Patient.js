// models/Patient.js
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    latestHealthScore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Health",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;