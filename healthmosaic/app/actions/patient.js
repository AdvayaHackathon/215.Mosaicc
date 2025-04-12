// app/actions.js
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongodb";
import Patient from "@/models/Patient";
import Health from "@/models/Health";

/**
 * Get patient data from Clerk ID
 */
export async function getPatient(userId) {
  try {
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    await connectToDB();
    
    let patient = await Patient.findOne({ clerkId: userId });
    
    // If patient doesn't exist yet, create one
    if (!patient) {
      // Create new patient with basic info
      patient = new Patient({
        clerkId: userId,
        name: "User", // You can update this later with user profile
        email: "user@example.com", // You can update this later
      });
      
      await patient.save();
    }
    
    // Get latest health record if exists
    let latestHealth = null;
    
    if (patient.latestHealthScore) {
      latestHealth = await Health.findById(patient.latestHealthScore);
    }
    
    return {
      success: true,
      patient: {
        id: patient._id.toString(),
        name: patient.name,
        email: patient.email,
      },
      latestHealth: latestHealth ? {
        score: latestHealth.score,
        date: latestHealth.createdAt.toISOString(),
        bmi: latestHealth.metrics?.bmi,
        data: latestHealth.data ? {
          age: latestHealth.data.age,
          weight: latestHealth.data.weight,
          height: latestHealth.data.height,
          exercise: latestHealth.data.exercise,
          sleep: latestHealth.data.sleep,
          stress: latestHealth.data.stress
        } : null
      } : null,
    };
  } catch (error) {
    console.error("Error getting patient:", error);
    return { success: false, error: "Failed to get patient data" };
  }
}

/**
 * Calculate health score and save to database
 */
export async function calculateHealthScore(data,userId) {
  try {
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    await connectToDB();
    
    // Find patient
    let patient = await Patient.findOne({ clerkId: userId });
    
    if (!patient) {
      // Create patient if not exists
      patient = new Patient({
        clerkId: userId,
        name: "User",
        email: "user@example.com",
      });
      
      await patient.save();
    }
    
    // Calculate health score
    const score = calculateHealthScoreAlgorithm(data);
    
    // Create health record
    const health = new Health({
      patient: patient._id,
      score,
      data,
    });
    
    await health.save();
    
    // Update patient with latest health score
    patient.latestHealthScore = health._id;
    await patient.save();
    
    // Revalidate the dashboard path to update UI
    revalidatePath("/dashboard");
    
    return {
      success: true,
      score,
      health: {
        id: health._id.toString(),
        score: health.score,
        date: health.createdAt.toISOString(),
        bmi: health.metrics?.bmi,
      }
    };
  } catch (error) {
    console.error("Error calculating health score:", error);
    return { success: false, error: "Failed to calculate health score" };
  }
}

/**
 * Get health history for a patient
 */
export async function getHealthHistory(limit = 10,userId) {
  try {
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    await connectToDB();
    
    // Find patient
    const patient = await Patient.findOne({ clerkId: userId });
    
    if (!patient) {
      return { success: true, records: [] };
    }
    
    // Get health records for the patient
    const healthRecords = await Health.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Format records for client
    const formattedRecords = healthRecords.map(record => ({
      id: record._id.toString(),
      score: record.score,
      // Convert Date object to ISO string for serialization
      date: record.createdAt.toISOString(),
      bmi: record.metrics?.bmi,
      // Ensure data object is serializable by creating a plain object
      data: record.data ? {
        age: record.data.age,
        weight: record.data.weight,
        height: record.data.height,
        exercise: record.data.exercise,
        sleep: record.data.sleep,
        stress: record.data.stress
      } : null
    }));
    
    return {
      success: true,
      records: formattedRecords,
    };
  } catch (error) {
    console.error("Error fetching health history:", error);
    return { success: false, error: "Failed to fetch health history" };
  }
}

/**
 * Update patient profile
 */
export async function updatePatientProfile(profileData,userId) {
  try {
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }
    
    await connectToDB();
    
    const patient = await Patient.findOne({ clerkId: userId });
    
    if (!patient) {
      return { success: false, error: "Patient not found" };
    }
    
    // Update patient data
    Object.assign(patient, profileData);
    await patient.save();
    
    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    
    return {
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
      }
    };
  } catch (error) {
    console.error("Error updating patient profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

/**
 * Health score calculation algorithm
 */
function calculateHealthScoreAlgorithm(data) {
  // BMI calculation
  const heightInMeters = data.height / 100;
  const bmi = data.weight / (heightInMeters * heightInMeters);
  
  // Simple scoring algorithm
  let score = 70; // Base score
  
  // Adjust based on BMI (ideal range 18.5-24.9)
  if (bmi >= 18.5 && bmi <= 24.9) {
    score += 10;
  } else if ((bmi >= 17 && bmi < 18.5) || (bmi > 24.9 && bmi <= 29.9)) {
    score += 5;
  } else {
    score -= 5;
  }
  
  // Adjust based on exercise (more is better)
  score += Math.min(data.exercise * 2, 10);
  
  // Adjust based on sleep (7-9 hours is ideal)
  if (data.sleep >= 7 && data.sleep <= 9) {
    score += 10;
  } else if ((data.sleep >= 6 && data.sleep < 7) || (data.sleep > 9 && data.sleep <= 10)) {
    score += 5;
  }
  
  // Adjust based on stress (lower is better)
  score -= Math.min(data.stress, 10);
  
  // Age factor
  if (data.age > 60) {
    score -= Math.min(Math.floor((data.age - 60) / 5), 5);
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}