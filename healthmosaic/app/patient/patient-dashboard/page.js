"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getPatient, getHealthHistory } from "../../actions/patient";

export default function PatientDashboard() {
  const [patientData, setPatientData] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState({
    heartHealth: { score: 85, color: 'teal' },
    respiratory: { score: 75, color: 'teal' },
    metabolic: { score: 68, color: 'yellow' },
    skeletal: { score: 90, color: 'green' }
  });
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Get patient data
        const patientResponse = await getPatient(userId);
        if (patientResponse.success) {
          setPatientData(patientResponse);
        }
        
        // Get health history
        const historyResponse = await getHealthHistory(10, userId);
        if (historyResponse.success) {
          setHealthHistory(historyResponse.records);
          
          // Calculate health metrics using latest data and history
          if (patientResponse.success && historyResponse.success) {
            calculateHealthMetrics(patientResponse.latestHealth, historyResponse.records);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (userId) {
      loadData();
    }
  }, [userId]);

  // Calculate breakdown metrics based on health data
  const calculateHealthMetrics = (latestHealth, historyRecords) => {
    if (!latestHealth) return;
    
    // Get latest health record data
    const latestRecord = historyRecords.length > 0 ? historyRecords[0] : null;
    const data = latestRecord?.data || {};
    
    // Calculate heart health score based on age, exercise, and historical trends
    let heartScore = 75; // Base score
    
    if (data.exercise) {
      // More exercise is better for heart health
      heartScore += Math.min(data.exercise * 3, 15);
    }
    
    if (data.age) {
      // Age factor (minor impact)
      heartScore -= Math.min(Math.floor((data.age - 30) / 10), 10);
    }
    
    // Track improvement in heart health over time using history
    if (historyRecords.length >= 2) {
      const previousExercise = historyRecords[1]?.data?.exercise || 0;
      if (data.exercise > previousExercise) {
        heartScore += 5; // Improvement bonus
      }
    }
    
    // Calculate respiratory score based on exercise and stress
    let respiratoryScore = 70; // Base score
    
    if (data.exercise) {
      // More exercise improves respiratory health
      respiratoryScore += Math.min(data.exercise * 2, 10);
    }
    
    if (data.stress) {
      // Higher stress negatively impacts respiratory health
      respiratoryScore -= Math.min(data.stress, 10);
    }
    
    // Sleep impacts respiratory health
    if (data.sleep >= 7 && data.sleep <= 9) {
      respiratoryScore += 10;
    }
    
    // Calculate metabolic score primarily based on BMI
    let metabolicScore = 70; // Base score
    
    if (latestHealth.bmi) {
      // Ideal BMI range is 18.5-24.9
      if (latestHealth.bmi >= 18.5 && latestHealth.bmi <= 24.9) {
        metabolicScore += 20;
      } else if ((latestHealth.bmi >= 17 && latestHealth.bmi < 18.5) || (latestHealth.bmi > 24.9 && latestHealth.bmi <= 29.9)) {
        metabolicScore += 10;
      } else if (latestHealth.bmi > 35) {
        metabolicScore -= 10;
      }
    }
    
    // Exercise also impacts metabolic health
    if (data.exercise >= 3) {
      metabolicScore += 5;
    }
    
    // Calculate skeletal score based on exercise, age, and weight
    let skeletalScore = 70; // Base score
    
    if (data.exercise) {
      // Weight-bearing exercise is good for skeletal health
      skeletalScore += Math.min(data.exercise * 3, 15);
    }
    
    if (data.age > 50) {
      // Bone density decreases with age
      skeletalScore -= Math.min(Math.floor((data.age - 50) / 5), 10);
    }
    
    // Weight impacts skeletal health (too low or too high can be issues)
    if (latestHealth.bmi) {
      if (latestHealth.bmi < 18.5) {
        skeletalScore -= 5; // Underweight can lead to bone density issues
      } else if (latestHealth.bmi > 30) {
        skeletalScore -= 5; // Very overweight puts stress on joints
      }
    }
    
    // Ensure all scores are within 0-100 range
    heartScore = Math.max(0, Math.min(100, Math.round(heartScore)));
    respiratoryScore = Math.max(0, Math.min(100, Math.round(respiratoryScore)));
    metabolicScore = Math.max(0, Math.min(100, Math.round(metabolicScore)));
    skeletalScore = Math.max(0, Math.min(100, Math.round(skeletalScore)));
    
    // Update state with calculated metrics
    setHealthMetrics({
      heartHealth: { 
        score: heartScore,
        color: getMetricColor(heartScore)
      },
      respiratory: { 
        score: respiratoryScore,
        color: getMetricColor(respiratoryScore)
      },
      metabolic: { 
        score: metabolicScore,
        color: getMetricColor(metabolicScore)
      },
      skeletal: { 
        score: skeletalScore,
        color: getMetricColor(skeletalScore)
      }
    });
  };
  
  // Get color based on metric score
  const getMetricColor = (score) => {
    if (score >= 85) return 'green';
    if (score >= 75) return 'teal';
    if (score >= 65) return 'blue';
    return 'yellow';
  };

  // Calculate health score color and status text
  const getScoreDetails = (score) => {
    if (score >= 80) return { color: "text-green-500", status: "Excellent" };
    if (score >= 70) return { color: "text-teal-500", status: "Good" };
    if (score >= 60) return { color: "text-blue-500", status: "Average" };
    return { color: "text-yellow-500", status: "Needs Improvement" };
  };

  // Calculate gauge angle based on score (0-100)
  const calculateGaugeAngle = (score) => {
    // Convert score to angle (0-180 degrees)
    const angle = (score / 100) * 180;
    return `rotate(${angle}deg)`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  const scoreValue = patientData?.latestHealth?.score || 78;
  const { color, status } = getScoreDetails(scoreValue);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="font-medium text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            MedDash
          </h1>
        </div>
        <nav className="mt-4">
          <Link href="/patient-dashboard" className="flex items-center px-4 py-3 bg-gray-100 text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link href="/patient-consult" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Consult Doctors
          </Link>
          <Link href="/patient-reports" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Medical Reports
          </Link>
          <Link href="/health-assistant" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Health Assistant
          </Link>
          <Link href="/image-analysis" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image Analysis
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">My Health Dashboard</h1>
          <div className="flex items-center">
            <button className="mr-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">{patientData?.patient?.name || "John Smith"}</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                {patientData?.patient?.name ? patientData.patient.name.substring(0, 2).toUpperCase() : "JS"}
              </div>
            </div>
          </div>
        </div>

        {/* Health Score Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Your Health Score</h2>
          <div className="flex items-center">
            <div className="relative mr-8">
              {/* Health Score Gauge - Using a cleaner approach with clip-path */}
              <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center relative">
                {/* Background ring */}
                <div className="absolute inset-2 rounded-full border-8 border-gray-200"></div>
                
                {/* Score indicator */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <path 
                    d={`M 50,50 L 50,10 A 40,40 0 ${scoreValue > 50 ? 1 : 0},1 ${50 + 40 * Math.sin(Math.PI * scoreValue / 50)},${50 - 40 * Math.cos(Math.PI * scoreValue / 50)} Z`} 
                    fill={color.replace('text-', 'fill-').replace('-500', '')}
                    className={`${color.replace('text', 'fill')}`}
                    opacity="0.8"
                  />
                </svg>
                
                {/* Center circle with score */}
                <div className="z-10 rounded-full bg-white h-28 w-28 flex items-center justify-center shadow-inner">
                  <div className={`${color} text-3xl font-bold`}>{scoreValue}</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 text-center text-sm font-medium -mb-2">{status}</div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium mb-2">Breakdown</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Heart Health</span>
                    <span className={`text-sm font-medium ${healthMetrics.heartHealth.color === 'green' ? 'text-green-600' : healthMetrics.heartHealth.color === 'teal' ? 'text-teal-600' : healthMetrics.heartHealth.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {healthMetrics.heartHealth.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthMetrics.heartHealth.color === 'green' ? 'bg-green-500' : healthMetrics.heartHealth.color === 'teal' ? 'bg-teal-500' : healthMetrics.heartHealth.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${healthMetrics.heartHealth.score}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Respiratory</span>
                    <span className={`text-sm font-medium ${healthMetrics.respiratory.color === 'green' ? 'text-green-600' : healthMetrics.respiratory.color === 'teal' ? 'text-teal-600' : healthMetrics.respiratory.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {healthMetrics.respiratory.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthMetrics.respiratory.color === 'green' ? 'bg-green-500' : healthMetrics.respiratory.color === 'teal' ? 'bg-teal-500' : healthMetrics.respiratory.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${healthMetrics.respiratory.score}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Metabolic</span>
                    <span className={`text-sm font-medium ${healthMetrics.metabolic.color === 'green' ? 'text-green-600' : healthMetrics.metabolic.color === 'teal' ? 'text-teal-600' : healthMetrics.metabolic.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {healthMetrics.metabolic.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthMetrics.metabolic.color === 'green' ? 'bg-green-500' : healthMetrics.metabolic.color === 'teal' ? 'bg-teal-500' : healthMetrics.metabolic.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${healthMetrics.metabolic.score}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Skeletal</span>
                    <span className={`text-sm font-medium ${healthMetrics.skeletal.color === 'green' ? 'text-green-600' : healthMetrics.skeletal.color === 'teal' ? 'text-teal-600' : healthMetrics.skeletal.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {healthMetrics.skeletal.score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${healthMetrics.skeletal.color === 'green' ? 'bg-green-500' : healthMetrics.skeletal.color === 'teal' ? 'bg-teal-500' : healthMetrics.skeletal.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                      style={{ width: `${healthMetrics.skeletal.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex">
                <Link href="/patient-reports" className="text-white bg-teal-600 hover:bg-teal-700 py-2 px-4 rounded-md text-sm flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Medical Reports
                </Link>
                <Link href="#" className="text-gray-700 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Vitals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Vitals</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Blood Pressure</span>
                <span className="text-sm font-medium">120/80 mmHg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Heart Rate</span>
                <span className="text-sm font-medium">72 bpm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Oxygen Saturation</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Temperature</span>
                <span className="text-sm font-medium">98.6°F</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">Last updated: April 5, 2023</p>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Upcoming Appointments</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Dr. Sarah Chen</span>
                  <span className="text-xs text-gray-500">Apr 15, 10:30 AM</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">Annual Check-up</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Dr. James Rodriguez</span>
                  <span className="text-xs text-gray-500">Apr 22, 2:15 PM</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">Cardiology Consultation</div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/patient-consult" className="text-teal-600 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Schedule Appointment
              </Link>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Current Medications</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Atorvastatin 20mg</div>
                  <div className="text-xs text-gray-500">Daily, Morning</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">Vitamin D 2000 IU</div>
                  <div className="text-xs text-gray-500">Daily, With Food</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link href="#" className="text-teal-600 text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                View All Medications
              </Link>
            </div>
          </div>
        </div>

        {/* Health History Section */}
        {healthHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Health History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sleep</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {healthHistory.map((record) => {
                    // Parse the ISO string date back to a Date object
                    const date = new Date(record.date);
                    const formattedDate = date.toLocaleDateString();
                    
                    return (
                      <tr key={record.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{formattedDate}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{record.score}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{record.bmi || "N/A"}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{record.data?.exercise || "N/A"} days/week</td>
                        <td className="px-4 py-2 whitespace-nowrap">{record.data?.sleep || "N/A"} hours</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Upload Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium">Upload Health Reports</h2>
            <p className="text-sm text-gray-500 mt-1">Upload your medical reports to get instant analysis and improve your health score</p>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600 mb-1">Drag and drop your files here, or</p>
              <button className="text-teal-600 font-medium text-sm hover:text-teal-700">browse files</button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG (up to 10MB)</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Link href="/patient-reports" className="text-white bg-teal-600 hover:bg-teal-700 py-2 px-4 rounded-md text-sm font-medium">
                Upload Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Health Tools */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="font-medium">Health Tools</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Link href="/image-analysis" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Image Analysis</span>
              </Link>
              <Link href="/health-assistant" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-sm font-medium">Health Assistant</span>
              </Link>
              <Link href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-sm font-medium">Symptom Checker</span>
              </Link>
              <Link href="#" className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Medication Reminder</span>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium">Recent Activities</h3>
              </div>
              <button className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
            <div className="divide-y">
              <div className="px-6 py-4 flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Uploaded blood test results</p>
                  <p className="text-xs text-gray-500">Today, 10:15 AM</p>
                </div>
              </div>
              <div className="px-6 py-4 flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Completed health assessment</p>
                  <p className="text-xs text-gray-500">Yesterday, 3:30 PM</p>
                </div>
              </div>
              <div className="px-6 py-4 flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm">Consulted with Dr. Sarah Chen</p>
                  <p className="text-xs text-gray-500">April 5, 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 