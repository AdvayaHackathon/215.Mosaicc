import mongoose from 'mongoose';

// Define the health score schema
const healthScoreSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  bmi: {
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    value: { type: Number },
    category: { type: String },
  },
  physicalHealth: {
    score: { type: Number, default: 0 },
    responses: { type: Map, of: Number, default: {} },
  },
  mentalHealth: {
    score: { type: Number, default: 0 },
    responses: { type: Map, of: Number, default: {} },
  },
  nutritionHealth: {
    score: { type: Number, default: 0 },
    responses: { type: Map, of: Number, default: {} },
  },
  sleepHealth: {
    score: { type: Number, default: 0 },
    responses: { type: Map, of: Number, default: {} },
  },
  overallHealthScore: {
    type: Number,
    default: 0,
  },
  assessmentHistory: [{
    date: { type: Date, default: Date.now },
    bmi: {
      value: { type: Number },
      category: { type: String },
    },
    overallScore: { type: Number },
    categories: {
      physicalHealth: { type: Number },
      mentalHealth: { type: Number },
      nutritionHealth: { type: Number },
      sleepHealth: { type: Number },
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create or use existing model
const User = mongoose.models.User || mongoose.model('User', healthScoreSchema);

export default User;