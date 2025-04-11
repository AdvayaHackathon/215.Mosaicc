// models/Health.js
import mongoose from "mongoose";

const HealthSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    data: {
      age: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      exercise: {
        type: Number,
        required: true,
      },
      sleep: {
        type: Number,
        required: true,
      },
      stress: {
        type: Number,
        required: true,
      },
    },
    metrics: {
      bmi: Number
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate and set BMI before saving
HealthSchema.pre("save", function (next) {
  if (this.data.height && this.data.weight) {
    const heightInMeters = this.data.height / 100;
    const bmi = this.data.weight / (heightInMeters * heightInMeters);
    
    if (!this.metrics) {
      this.metrics = {};
    }
    
    this.metrics.bmi = parseFloat(bmi.toFixed(2));
  }
  next();
});

const Health = mongoose.models.Health || mongoose.model("Health", HealthSchema);

export default Health;