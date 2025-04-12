'use client'
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { saveUserHealthData, getUserHealthData } from '@/lib/userActions';
import {
  healthQuestions,
  calculateBMI,
  calculateCategoryScore,
  calculateOverallHealthScore,
  getHealthScoreColor,
  getRecommendations
} from '@/lib/healthAssessment';

export default function HealthAssessment() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // User inputs
  const [basicInfo, setBasicInfo] = useState({
    height: '',
    weight: '',
    age: '',
    gender: ''
  });
  // Category responses
  const [responses, setResponses] = useState({
    physicalHealth: {},
    mentalHealth: {},
    nutritionHealth: {},
    sleepHealth: {}
  });
  // Results
  const [results, setResults] = useState({
    bmi: { value: 0, category: '' },
    categoryScores: {
      physicalHealth: 0,
      mentalHealth: 0,
      nutritionHealth: 0,
      sleepHealth: 0
    },
    overallHealthScore: 0,
    recommendations: {}
  });
  const [showResults, setShowResults] = useState(false);
  // Categories for the assessment
  const categories = [
    { id: 'basicInfo', name: 'Basic Information' },
    { id: 'physicalHealth', name: 'Physical Health' },
    { id: 'mentalHealth', name: 'Mental Health' },
    { id: 'nutritionHealth', name: 'Nutrition' },
    { id: 'sleepHealth', name: 'Sleep Quality' }
  ];
  // Check if user is logged in
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);
  // Handle basic info change
  const handleBasicInfoChange = (id, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };
  // Handle response selection
  const handleResponseSelect = (category, questionId, value, points) => {
    setResponses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [questionId]: points
      }
    }));
  };
  // Check if current step is complete
  const isCurrentStepComplete = () => {
    const currentCategory = categories[step].id;
    if (currentCategory === 'basicInfo') {
      return (
        basicInfo.height &&
        basicInfo.weight &&
        basicInfo.age &&
        basicInfo.gender
      );
    }
    const questions = healthQuestions[currentCategory];
    const categoryResponses = responses[currentCategory];
    return questions.every(q => categoryResponses[q.id] !== undefined);
  };
  // Go to next step
  const goToNextStep = () => {
    if (step < categories.length - 1) {
      setStep(step + 1);
    } else {
      calculateResults();
    }
  };
  // Go to previous step
  const goToPreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  // Calculate results
  const calculateResults = () => {
    setLoading(true);
    try {
      // Calculate BMI
      const bmi = calculateBMI(
        parseFloat(basicInfo.weight),
        parseFloat(basicInfo.height)
      );
      // Calculate scores for each category
      const categoryScores = {
        physicalHealth: calculateCategoryScore(responses.physicalHealth),
        mentalHealth: calculateCategoryScore(responses.mentalHealth),
        nutritionHealth: calculateCategoryScore(responses.nutritionHealth),
        sleepHealth: calculateCategoryScore(responses.sleepHealth)
      };
      // Calculate overall health score
      const overallHealthScore = calculateOverallHealthScore(categoryScores, bmi);
      // Get recommendations
      const recommendations = getRecommendations(categoryScores, bmi);
      // Set results
      const resultData = {
        bmi,
        categoryScores,
        overallHealthScore,
        recommendations
      };
      setResults(resultData);
      // Save results to database
      saveResultsToDatabase(resultData);
      // Show results
      setShowResults(true);
    } catch (e) {
      setError('An error occurred while calculating your health score.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // Save results to database
  const saveResultsToDatabase = async (resultData) => {
    try {
      // Prepare health data for saving
      const healthData = {
        bmi: {
          height: parseFloat(basicInfo.height),
          weight: parseFloat(basicInfo.weight),
          value: resultData.bmi.value,
          category: resultData.bmi.category
        },
        physicalHealth: {
          score: resultData.categoryScores.physicalHealth,
          responses: responses.physicalHealth
        },
        mentalHealth: {
          score: resultData.categoryScores.mentalHealth,
          responses: responses.mentalHealth
        },
        nutritionHealth: {
          score: resultData.categoryScores.nutritionHealth,
          responses: responses.nutritionHealth
        },
        sleepHealth: {
          score: resultData.categoryScores.sleepHealth,
          responses: responses.sleepHealth
        },
        overallHealthScore: resultData.overallHealthScore
      };
      // Save to database
      const saveResult = await saveUserHealthData(user.id, healthData);
      if (!saveResult.success) {
        console.error('Failed to save health data:', saveResult.error);
      }
    } catch (e) {
      console.error('Error saving results to database:', e);
    }
  };
  // Restart assessment
  const restartAssessment = () => {
    setStep(0);
    setBasicInfo({
      height: '',
      weight: '',
      age: '',
      gender: ''
    });
    setResponses({
      physicalHealth: {},
      mentalHealth: {},
      nutritionHealth: {},
      sleepHealth: {}
    });
    setResults({
      bmi: { value: 0, category: '' },
      categoryScores: {
        physicalHealth: 0,
        mentalHealth: 0,
        nutritionHealth: 0,
        sleepHealth: 0
      },
      overallHealthScore: 0,
      recommendations: {}
    });
    setShowResults(false);
    setError('');
  };
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Health Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Complete this assessment to get personalized health insights
          </p>
        </div>
        
        {!showResults ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Progress steps */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="flex justify-between items-center">
                {categories.map((category, index) => (
                  <div key={category.id} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mb-1
                        ${index < step ? 'bg-white text-indigo-600' : 
                          index === step ? 'bg-white text-indigo-600 ring-4 ring-indigo-300' : 
                          'bg-indigo-200 text-indigo-600'}`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs font-medium text-white hidden sm:block">
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form content */}
            <div className="px-6 py-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {categories[step].name}
              </h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {categories[step].id === 'basicInfo' ? (
                <div className="space-y-6">
                  {healthQuestions.basicInfo.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {question.question}
                      </label>
                      {question.type === 'number' ? (
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <input
                            type="number"
                            name={question.id}
                            id={question.id}
                            value={basicInfo[question.id]}
                            onChange={(e) => handleBasicInfoChange(question.id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="0"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">{question.unit}</span>
                          </div>
                        </div>
                      ) : (
                        <select
                          name={question.id}
                          id={question.id}
                          value={basicInfo[question.id]}
                          onChange={(e) => handleBasicInfoChange(question.id, e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select an option</option>
                          {question.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {healthQuestions[categories[step].id].map((question) => (
                    <div key={question.id} className="space-y-3">
                      <h3 className="text-md font-medium text-gray-800">
                        {question.question}
                      </h3>
                      <div className="grid gap-2">
                        {question.options.map((option) => (
                          <div 
                            key={option.value}
                            className={`
                              border rounded-lg p-3 cursor-pointer transition-all duration-200
                              ${responses[categories[step].id][question.id] === option.points 
                                ? 'border-indigo-500 bg-indigo-50' 
                                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                              }
                            `}
                            onClick={() => handleResponseSelect(
                              categories[step].id,
                              question.id,
                              option.value,
                              option.points
                            )}
                          >
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                className="form-radio text-indigo-600 h-4 w-4"
                                checked={responses[categories[step].id][question.id] === option.points}
                                onChange={() => {}}
                              />
                              <span className="ml-2 text-gray-700">{option.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <button
                onClick={goToPreviousStep}
                disabled={step === 0}
                className={`px-4 py-2 rounded-md ${
                  step === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Back
              </button>
              <button
                onClick={goToNextStep}
                disabled={!isCurrentStepComplete()}
                className={`px-4 py-2 rounded-md ${
                  isCurrentStepComplete()
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step === categories.length - 1 ? 'Complete Assessment' : 'Next'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Calculating your health score...</p>
              </div>
            ) : (
              <div>
                {/* Results header */}
                <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
                  <h2 className="text-2xl font-bold mb-2">Your Health Assessment Results</h2>
                  <p className="text-blue-100">Based on your responses, here's your personalized health evaluation</p>
                </div>
                
                {/* Overall score */}
                <div className="p-6 flex flex-col items-center border-b">
                  <div className="relative mb-4">
                    <svg className="w-32 h-32" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={getHealthScoreColor(results.overallHealthScore)}
                        strokeWidth="3"
                        strokeDasharray={`${results.overallHealthScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-3xl font-bold">{results.overallHealthScore}</div>
                      <div className="text-sm text-gray-500">Overall Score</div>
                    </div>
                  </div>
                  
                  <p className="text-lg font-semibold mb-2">
                    {results.overallHealthScore >= 80 
                      ? 'Excellent Health' 
                      : results.overallHealthScore >= 60 
                        ? 'Good Health' 
                        : results.overallHealthScore >= 40 
                          ? 'Fair Health' 
                          : 'Needs Improvement'}
                  </p>
                  <p className="text-gray-600 text-center max-w-lg">
                    Your BMI is {results.bmi.value} ({results.bmi.category}). This assessment provides a snapshot of your current health status based on your responses.
                  </p>
                </div>
                
                {/* Category scores */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(results.categoryScores).map(([category, score]) => {
                    const formattedCategory = category.replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .replace('Health', '');
                    
                    return (
                      <div key={category} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{formattedCategory}</h3>
                          <span 
                            className="font-semibold text-sm px-2 py-1 rounded-full" 
                            style={{ 
                              backgroundColor: `${getHealthScoreColor(score)}20`,
                              color: getHealthScoreColor(score)
                            }}
                          >
                            {score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${score}%`,
                              backgroundColor: getHealthScoreColor(score) 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Recommendations */}
                <div className="p-6 border-t">
                  <h3 className="text-xl font-bold mb-4">Your Personalized Recommendations</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(results.recommendations).map(([category, recs]) => {
                      if (recs.length === 0) return null;
                      
                      let categoryTitle;
                      let icon;
                      
                      switch(category) {
                        case 'physicalHealth':
                          categoryTitle = 'Physical Activity';
                          icon = '🏃‍♂️';
                          break;
                        case 'mentalHealth':
                          categoryTitle = 'Mental Wellbeing';
                          icon = '🧠';
                          break;
                        case 'nutritionHealth':
                          categoryTitle = 'Nutrition';
                          icon = '🥗';
                          break;
                        case 'sleepHealth':
                          categoryTitle = 'Sleep';
                          icon = '😴';
                          break;
                        case 'bmi':
                          categoryTitle = 'Weight Management';
                          icon = '⚖️';
                          break;
                        default:
                          categoryTitle = category;
                          icon = '✅';
                      }
                      
                      return (
                        <div key={category} className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-lg mb-2 flex items-center">
                            <span className="mr-2">{icon}</span>
                            {categoryTitle}
                          </h4>
                          <ul className="space-y-2 ml-6">
                            {recs.map((rec, i) => (
                              <li key={i} className="text-gray-700 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={restartAssessment}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md text-white hover:from-blue-700 hover:to-indigo-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This assessment is for informational purposes only and should not replace professional medical advice.</p>
        </div>
      </div>
    </div>
  );
}