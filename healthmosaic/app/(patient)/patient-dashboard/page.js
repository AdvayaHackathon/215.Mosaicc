"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateHealthScore,getHealthHistory,getPatient } from "../../actions/patient";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const router = useRouter();
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [healthScore, setHealthScore] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [optimisticScore, setOptimisticScore] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);
  const {user} = useUser()
  const userId = user?.id
  // Questions for health assessment
  const questions = [
    {
      id: "age",
      text: "What is your age?",
      type: "number",
      min: 18,
      max: 120,
    },
    {
      id: "weight",
      text: "What is your weight in kg?",
      type: "number",
      min: 30,
      max: 300,
    },
    {
      id: "height",
      text: "What is your height in cm?",
      type: "number",
      min: 100,
      max: 250,
    },
    {
      id: "exercise",
      text: "How many days per week do you exercise?",
      type: "number",
      min: 0,
      max: 7,
    },
    {
      id: "sleep",
      text: "How many hours do you sleep on average?",
      type: "number",
      min: 1,
      max: 16,
    },
    {
      id: "stress",
      text: "On a scale of 1-10, how would you rate your stress level?",
      type: "number",
      min: 1,
      max: 10,
    },
  ];

  // Load patient data and history on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // Get patient data
        const patientResponse = await getPatient(userId);
        if (patientResponse.success) {
          setPatientData(patientResponse);
          
          // If patient has a latest health score, set it
          if (patientResponse.latestHealth) {
            setHealthScore(patientResponse.latestHealth.score);
          }
        }

        // Get health history
        const historyResponse = await getHealthHistory();
        if (historyResponse.success) {
          setHealthHistory(historyResponse.records);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle starting the assessment
  const handleStartAssessment = () => {
    setShowQuestions(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  // Handle answer changes
  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: parseInt(e.target.value),
    });
  };

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate optimistic score locally for immediate feedback
      const score = calculateOptimisticScore(answers);
      setOptimisticScore(score);
      
      // Submit data to server
      submitHealthData();
    }
  };

  // Calculate optimistic score for immediate feedback
  const calculateOptimisticScore = (data) => {
    // BMI calculation
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    
    // Simple scoring algorithm (same as server)
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
    
    // Ensure score is between 0-100
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Submit health data to server
  const submitHealthData = async () => {
    try {
      setIsCalculating(true);
      
      // Send data to server using server action
      const result = await calculateHealthScore(answers,userId);
      
      if (result.success) {
        // Update with actual score from server
        setHealthScore(result.score);
        
        // Refresh health history
        const historyResponse = await getHealthHistory(userId);
        if (historyResponse.success) {
          setHealthHistory(historyResponse.records);
        }
        
        // Refresh the page data
        router.refresh();
      } else {
        alert("Error calculating health score: " + result.error);
      }
    } catch (error) {
      console.error("Error calculating health score:", error);
      alert("Error calculating health score. Please try again.");
    } finally {
      setIsCalculating(false);
      setShowQuestions(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render health score display
  const renderHealthScore = () => {
    const score = healthScore !== null ? healthScore : optimisticScore;
    
    if (!score) return null;
    
    let statusColor = "text-yellow-500";
    let statusText = "Average";
    
    if (score >= 80) {
      statusColor = "text-green-500";
      statusText = "Excellent";
    } else if (score >= 60) {
      statusColor = "text-blue-500";
      statusText = "Good";
    } else if (score < 50) {
      statusColor = "text-red-500";
      statusText = "Needs Improvement";
    }
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Health Score</h2>
        
        <div className="flex items-center justify-between">
          <div className={`text-5xl font-bold ${statusColor}`}>{score}</div>
          <div className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor} bg-opacity-20`}>
            {statusText}
          </div>
        </div>
        
        <p className="text-gray-600 mt-4">
          Your health score is calculated based on your BMI, exercise habits,
          sleep patterns, and stress levels.
        </p>
        
        <button
          onClick={handleStartAssessment}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retake Assessment
        </button>
      </div>
    );
  };

  // Render health history
  const renderHealthHistory = () => {
    if (healthHistory.length === 0) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Health History</h2>
        
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
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Health Dashboard</h1>
      
      {/* Welcome section */}
      {!showQuestions && !healthScore && !optimisticScore && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome{patientData?.patient?.name ? `, ${patientData.patient.name}` : ""}!
          </h2>
          <p className="text-gray-600 mb-6">
            Answer a few questions to calculate your health score and get personalized insights.
          </p>
          <button
            onClick={handleStartAssessment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Your Health Score
          </button>
        </div>
      )}
      
      {/* Health Score Display */}
      {(healthScore || optimisticScore) && !showQuestions && renderHealthScore()}
      
      {/* Questions */}
      {showQuestions && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">
            {questions[currentQuestion].text}
          </h2>
          
          <div className="mb-6">
            <input
              type={questions[currentQuestion].type}
              min={questions[currentQuestion].min}
              max={questions[currentQuestion].max}
              value={answers[questions[currentQuestion].id] || ""}
              onChange={handleAnswerChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="flex justify-end">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-4 py-2 text-gray-600 mr-2"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNextQuestion}
              disabled={!answers[questions[currentQuestion].id]}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {currentQuestion < questions.length - 1 ? "Next" : "Calculate Score"}
            </button>
          </div>
        </div>
      )}
      
      {/* Health History */}
      {!showQuestions && healthHistory.length > 0 && renderHealthHistory()}
    </div>
  );
}