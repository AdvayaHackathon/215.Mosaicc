'use server'

import connectDB from './mongodb';
import User from '../models/User';

/**
 * Create or update user health data
 */
export async function saveUserHealthData(clerkUserId, healthData) {
  try {
    await connectDB();
    
    // Find existing user or create new one
    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        $set: {
          ...healthData,
          updatedAt: new Date(),
        },
        $push: {
          assessmentHistory: {
            date: new Date(),
            bmi: healthData.bmi,
            overallScore: healthData.overallHealthScore,
            categories: {
              physicalHealth: healthData.physicalHealth.score,
              mentalHealth: healthData.mentalHealth.score,
              nutritionHealth: healthData.nutritionHealth.score,
              sleepHealth: healthData.sleepHealth.score,
            }
          }
        }
      },
      { 
        new: true, 
        upsert: true 
      }
    );
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Error saving health data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user health data by clerk user ID
 */
export async function getUserHealthData(clerkUserId) {
  try {
    await connectDB();
    
    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error('Error fetching health data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get health assessment history
 */
export async function getUserHealthHistory(clerkUserId) {
  try {
    await connectDB();
    
    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    return { 
      success: true, 
      data: user.assessmentHistory 
    };
  } catch (error) {
    console.error('Error fetching health history:', error);
    return { success: false, error: error.message };
  }
}