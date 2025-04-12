'use client'

// Question sets for each health category
export const healthQuestions = {
  basicInfo: [
    {
      id: 'height',
      question: 'What is your height?',
      type: 'number',
      unit: 'cm',
      required: true,
    },
    {
      id: 'weight',
      question: 'What is your weight?',
      type: 'number',
      unit: 'kg',
      required: true,
    },
    {
      id: 'age',
      question: 'What is your age?',
      type: 'number',
      unit: 'years',
      required: true,
    },
    {
      id: 'gender',
      question: 'What is your gender?',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      required: true,
    }
  ],
  physicalHealth: [
    {
      id: 'exercise',
      question: 'How often do you exercise per week?',
      type: 'select',
      options: [
        { value: 'never', label: 'Never', points: 0 },
        { value: 'rarely', label: '1-2 times', points: 5 },
        { value: 'sometimes', label: '3-4 times', points: 8 },
        { value: 'often', label: '5+ times', points: 10 }
      ]
    },
    {
      id: 'energyLevels',
      question: 'How would you rate your overall energy levels?',
      type: 'select',
      options: [
        { value: 'veryLow', label: 'Very low', points: 0 },
        { value: 'low', label: 'Low', points: 3 },
        { value: 'moderate', label: 'Moderate', points: 6 },
        { value: 'high', label: 'High', points: 8 },
        { value: 'veryHigh', label: 'Very high', points: 10 }
      ]
    },
    {
      id: 'chronicPain',
      question: 'Do you experience chronic pain?',
      type: 'select',
      options: [
        { value: 'daily', label: 'Daily', points: 0 },
        { value: 'frequently', label: 'Frequently', points: 3 },
        { value: 'occasionally', label: 'Occasionally', points: 6 },
        { value: 'rarely', label: 'Rarely', points: 8 },
        { value: 'never', label: 'Never', points: 10 }
      ]
    },
    {
      id: 'stairClimbing',
      question: 'How do you feel after climbing a flight of stairs?',
      type: 'select',
      options: [
        { value: 'veryTired', label: 'Very tired/unable', points: 0 },
        { value: 'tired', label: 'Tired/winded', points: 3 },
        { value: 'slightlyTired', label: 'Slightly tired', points: 6 },
        { value: 'fine', label: 'Fine', points: 8 },
        { value: 'energized', label: 'Energized/no problem', points: 10 }
      ]
    }
  ],
  mentalHealth: [
    {
      id: 'stress',
      question: 'How would you rate your stress levels?',
      type: 'select',
      options: [
        { value: 'veryHigh', label: 'Very high', points: 0 },
        { value: 'high', label: 'High', points: 3 },
        { value: 'moderate', label: 'Moderate', points: 6 },
        { value: 'low', label: 'Low', points: 8 },
        { value: 'veryLow', label: 'Very low', points: 10 }
      ]
    },
    {
      id: 'mood',
      question: 'How would you describe your overall mood most days?',
      type: 'select',
      options: [
        { value: 'veryNegative', label: 'Very negative', points: 0 },
        { value: 'negative', label: 'Negative', points: 3 },
        { value: 'neutral', label: 'Neutral', points: 5 },
        { value: 'positive', label: 'Positive', points: 8 },
        { value: 'veryPositive', label: 'Very positive', points: 10 }
      ]
    },
    {
      id: 'concentration',
      question: 'How well can you concentrate on tasks?',
      type: 'select',
      options: [
        { value: 'veryPoor', label: 'Very poor', points: 0 },
        { value: 'poor', label: 'Poor', points: 3 },
        { value: 'fair', label: 'Fair', points: 5 },
        { value: 'good', label: 'Good', points: 8 },
        { value: 'excellent', label: 'Excellent', points: 10 }
      ]
    },
    {
      id: 'satisfaction',
      question: 'How satisfied are you with your life currently?',
      type: 'select',
      options: [
        { value: 'veryDissatisfied', label: 'Very dissatisfied', points: 0 },
        { value: 'dissatisfied', label: 'Dissatisfied', points: 3 },
        { value: 'neutral', label: 'Neutral', points: 5 },
        { value: 'satisfied', label: 'Satisfied', points: 8 },
        { value: 'verySatisfied', label: 'Very satisfied', points: 10 }
      ]
    }
  ],
  nutritionHealth: [
    {
      id: 'fruitsVegetables',
      question: 'How many servings of fruits and vegetables do you eat daily?',
      type: 'select',
      options: [
        { value: 'none', label: 'None', points: 0 },
        { value: 'one', label: '1 serving', points: 3 },
        { value: 'twoThree', label: '2-3 servings', points: 6 },
        { value: 'fourFive', label: '4-5 servings', points: 8 },
        { value: 'moreThanFive', label: 'More than 5 servings', points: 10 }
      ]
    },
    {
      id: 'processedFood',
      question: 'How often do you consume processed foods or fast food?',
      type: 'select',
      options: [
        { value: 'daily', label: 'Daily', points: 0 },
        { value: 'frequently', label: 'Frequently', points: 3 },
        { value: 'occasionally', label: 'Occasionally', points: 6 },
        { value: 'rarely', label: 'Rarely', points: 8 },
        { value: 'never', label: 'Never', points: 10 }
      ]
    },
    {
      id: 'water',
      question: 'How much water do you drink per day?',
      type: 'select',
      options: [
        { value: 'lessThan500ml', label: 'Less than 500ml', points: 0 },
        { value: '500ml1L', label: '500ml - 1L', points: 3 },
        { value: '1L2L', label: '1L - 2L', points: 6 },
        { value: '2L3L', label: '2L - 3L', points: 8 },
        { value: 'moreThan3L', label: 'More than 3L', points: 10 }
      ]
    },
    {
      id: 'mealPattern',
      question: 'How would you describe your meal pattern?',
      type: 'select',
      options: [
        { value: 'veryIrregular', label: 'Very irregular, often skip meals', points: 0 },
        { value: 'someIrregular', label: 'Somewhat irregular', points: 3 },
        { value: 'mostlyRegular', label: 'Mostly regular meals', points: 6 },
        { value: 'regular', label: 'Regular, 3 meals daily', points: 8 },
        { value: 'wellPlanned', label: 'Well-planned, regular meals and snacks', points: 10 }
      ]
    }
  ],
  sleepHealth: [
    {
      id: 'sleepDuration',
      question: 'How many hours of sleep do you get on average?',
      type: 'select',
      options: [
        { value: 'lessThan5', label: 'Less than 5 hours', points: 0 },
        { value: 'fiveSix', label: '5-6 hours', points: 3 },
        { value: 'sixSeven', label: '6-7 hours', points: 6 },
        { value: 'sevenEight', label: '7-8 hours', points: 8 },
        { value: 'moreThanEight', label: 'More than 8 hours', points: 10 }
      ]
    },
    {
      id: 'sleepQuality',
      question: 'How would you rate your sleep quality?',
      type: 'select',
      options: [
        { value: 'veryPoor', label: 'Very poor', points: 0 },
        { value: 'poor', label: 'Poor', points: 3 },
        { value: 'fair', label: 'Fair', points: 5 },
        { value: 'good', label: 'Good', points: 8 },
        { value: 'excellent', label: 'Excellent', points: 10 }
      ]
    },
    {
      id: 'wakingFeeling',
      question: 'How do you feel when you wake up?',
      type: 'select',
      options: [
        { value: 'veryTired', label: 'Very tired/exhausted', points: 0 },
        { value: 'tired', label: 'Tired', points: 3 },
        { value: 'neutral', label: 'Neutral', points: 5 },
        { value: 'refreshed', label: 'Refreshed', points: 8 },
        { value: 'veryRefreshed', label: 'Very refreshed/energized', points: 10 }
      ]
    },
    {
        id: 'sleepSchedule',
        question: 'Do you maintain a consistent sleep schedule?',
        type: 'select',
        options: [
          { value: 'veryInconsistent', label: 'Very inconsistent', points: 0 },
          { value: 'mostlyInconsistent', label: 'Mostly inconsistent', points: 3 },
          { value: 'somewhatConsistent', label: 'Somewhat consistent', points: 6 },
          { value: 'mostlyConsistent', label: 'Mostly consistent', points: 8 },
          { value: 'veryConsistent', label: 'Very consistent', points: 10 }
        ]
      }
    ]
  };
  
  // Calculate BMI and determine BMI category
  export function calculateBMI(weight, height) {
    // Convert height from cm to m and calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let category;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }
    
    return {
      value: parseFloat(bmi.toFixed(1)),
      category
    };
  }
  
  // Calculate score for a category based on responses
  export function calculateCategoryScore(responses) {
    if (!responses || Object.keys(responses).length === 0) {
      return 0;
    }
    
    const totalPoints = Object.values(responses).reduce((sum, points) => sum + points, 0);
    const maxPossiblePoints = Object.keys(responses).length * 10;
    
    return Math.round((totalPoints / maxPossiblePoints) * 100);
  }
  
  // Calculate overall health score based on all category scores and BMI
  export function calculateOverallHealthScore(categoryScores, bmi) {
    // Weight each category and BMI in the overall calculation
    const weights = {
      physicalHealth: 0.25,
      mentalHealth: 0.25,
      nutritionHealth: 0.25,
      sleepHealth: 0.25
    };
    
    // Apply BMI modifier (-10 points for obese/underweight, -5 for overweight, 0 for normal)
    let bmiModifier = 0;
    if (bmi.category === 'Obese' || bmi.category === 'Underweight') {
      bmiModifier = -10;
    } else if (bmi.category === 'Overweight') {
      bmiModifier = -5;
    }
    
    // Calculate weighted score
    const weightedScore = (
      categoryScores.physicalHealth * weights.physicalHealth +
      categoryScores.mentalHealth * weights.mentalHealth +
      categoryScores.nutritionHealth * weights.nutritionHealth +
      categoryScores.sleepHealth * weights.sleepHealth
    );
    
    // Apply BMI modifier and ensure score is between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(weightedScore + bmiModifier)));
    
    return finalScore;
  }
  
  // Get health color based on score
  export function getHealthScoreColor(score) {
    if (score >= 80) {
      return '#4ade80'; // Green for excellent
    } else if (score >= 60) {
      return '#facc15'; // Yellow for good
    } else if (score >= 40) {
      return '#fb923c'; // Orange for fair
    } else {
      return '#f87171'; // Red for poor
    }
  }
  
  // Get recommendations based on scores
  export function getRecommendations(categoryScores, bmi) {
    const recommendations = {
      physicalHealth: [],
      mentalHealth: [],
      nutritionHealth: [],
      sleepHealth: [],
      bmi: []
    };
    
    // Physical health recommendations
    if (categoryScores.physicalHealth < 50) {
      recommendations.physicalHealth = [
        "Start with short walks and gradually increase your physical activity",
        "Consider consulting with a healthcare provider before starting a new exercise routine",
        "Find physical activities you enjoy to make regular exercise more sustainable"
      ];
    } else if (categoryScores.physicalHealth < 80) {
      recommendations.physicalHealth = [
        "Aim for at least 150 minutes of moderate aerobic activity each week",
        "Include strength training exercises at least twice per week",
        "Listen to your body and ensure adequate recovery between workouts"
      ];
    } else {
      recommendations.physicalHealth = [
        "Maintain your excellent physical routine",
        "Consider adding variety to your workouts to challenge different muscle groups",
        "Share your fitness knowledge to inspire others"
      ];
    }
    
    // Mental health recommendations
    if (categoryScores.mentalHealth < 50) {
      recommendations.mentalHealth = [
        "Consider speaking with a mental health professional",
        "Practice mindfulness or meditation for at least 5 minutes daily",
        "Identify sources of stress in your life and develop coping strategies"
      ];
    } else if (categoryScores.mentalHealth < 80) {
      recommendations.mentalHealth = [
        "Practice relaxation techniques like deep breathing or progressive muscle relaxation",
        "Maintain social connections and seek support when needed",
        "Set aside time for activities you enjoy"
      ];
    } else {
      recommendations.mentalHealth = [
        "Continue your positive mental health practices",
        "Share your wellness strategies with others who might benefit",
        "Challenge yourself with new learning opportunities for mental stimulation"
      ];
    }
    
    // Nutrition health recommendations
    if (categoryScores.nutritionHealth < 50) {
      recommendations.nutritionHealth = [
        "Gradually increase your intake of fruits and vegetables",
        "Reduce consumption of processed foods and sugary drinks",
        "Consider consulting with a nutritionist for personalized advice"
      ];
    } else if (categoryScores.nutritionHealth < 80) {
      recommendations.nutritionHealth = [
        "Aim for at least 5 servings of fruits and vegetables daily",
        "Stay hydrated by drinking at least 8 glasses of water per day",
        "Plan and prepare meals in advance to maintain healthy eating habits"
      ];
    } else {
      recommendations.nutritionHealth = [
        "Maintain your excellent nutritional habits",
        "Explore new healthy recipes to keep meals interesting",
        "Consider periodic nutritional check-ups to address specific needs"
      ];
    }
    
    // Sleep health recommendations
    if (categoryScores.sleepHealth < 50) {
      recommendations.sleepHealth = [
        "Aim for 7-9 hours of sleep each night",
        "Create a relaxing bedtime routine",
        "Limit screen time and caffeine before bed"
      ];
    } else if (categoryScores.sleepHealth < 80) {
      recommendations.sleepHealth = [
        "Establish a consistent sleep schedule, even on weekends",
        "Optimize your sleep environment for comfort and minimal disruptions",
        "Practice relaxation techniques before bedtime"
      ];
    } else {
      recommendations.sleepHealth = [
        "Maintain your excellent sleep habits",
        "Monitor factors that may occasionally disrupt sleep",
        "Continue prioritizing quality sleep as part of your overall health"
      ];
    }
    
    // BMI recommendations
    if (bmi.category === 'Underweight') {
      recommendations.bmi = [
        "Consult with a healthcare provider for personalized advice",
        "Focus on nutrient-dense foods to help gain weight in a healthy way",
        "Consider working with a dietitian to develop a balanced meal plan"
      ];
    } else if (bmi.category === 'Overweight' || bmi.category === 'Obese') {
      recommendations.bmi = [
        "Consult with a healthcare provider before starting a weight loss program",
        "Focus on gradual, sustainable changes to diet and activity levels",
        "Set realistic goals for weight management"
      ];
    } else {
      recommendations.bmi = [
        "Maintain your healthy weight through balanced nutrition and regular physical activity",
        "Monitor your weight periodically to stay within the healthy range",
        "Focus on overall health rather than weight alone"
      ];
    }
    
    return recommendations;
  }