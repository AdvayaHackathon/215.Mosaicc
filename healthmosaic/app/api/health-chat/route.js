import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Emergency symptoms that should trigger the emergency alert
const EMERGENCY_SYMPTOMS = [
  'severe chest pain', 'heart attack', 'can\'t breathe', 'unable to breathe',
  'stroke', 'sudden numbness in face', 'face drooping', 'arm weakness',
  'slurred speech', 'sudden loss of vision', 'unconscious', 'unresponsive',
  'seizure', 'severe bleeding', 'coughing up blood', 'vomiting blood',
  'severe burn', 'electric shock', 'drowning', 'choking', 'anaphylaxis',
  'suicide', 'suicidal thoughts', 'overdose', 'poisoning'
];

// Medical specialties and conditions they treat
const MEDICAL_SPECIALTIES = {
  'Cardiologist': ['severe chest pain', 'heart palpitations', 'high blood pressure', 'coronary', 'heart failure', 'arrhythmia'],
  'Dermatologist': ['severe skin rash', 'spreading rash', 'changing mole', 'unusual growth', 'severe acne', 'persistent skin condition'],
  'Gastroenterologist': ['severe stomach pain', 'persistent digestive issues', 'chronic diarrhea', 'chronic constipation', 'blood in stool', 'difficulty swallowing'],
  'Neurologist': ['severe headache', 'chronic migraines', 'seizures', 'persistent dizziness', 'unexplained numbness', 'tremors'],
  'Orthopedist': ['broken bone', 'severe joint pain', 'persistent back pain', 'joint swelling', 'limited mobility', 'sports injury'],
  'ENT': ['hearing loss', 'severe sinus infection', 'persistent sore throat', 'difficulty swallowing', 'vocal changes', 'persistent ear pain'],
  'Ophthalmologist': ['vision loss', 'eye injury', 'severe eye pain', 'double vision', 'flashes of light'],
  'Gynecologist': ['unusual vaginal bleeding', 'severe menstrual pain', 'pregnancy concerns', 'pelvic pain', 'abnormal pap smear'],
  'Urologist': ['kidney stone', 'blood in urine', 'urinary retention', 'prostate issues', 'testicular pain'],
  'Psychiatrist': ['severe depression', 'suicidal thoughts', 'severe anxiety', 'hallucinations', 'mental health crisis']
};

// Directory of "local" doctors (just example data)
const LOCAL_DOCTORS = {
  'Cardiologist': [
    { name: 'Dr. Sarah Chen', hospital: 'City Heart Center', phone: '(555) 123-4567' },
    { name: 'Dr. Michael Rodriguez', hospital: 'University Medical Center', phone: '(555) 234-5678' },
  ],
  'Dermatologist': [
    { name: 'Dr. Emma Wilson', hospital: 'Skin Health Clinic', phone: '(555) 345-6789' },
    { name: 'Dr. David Park', hospital: 'City Medical Group', phone: '(555) 456-7890' },
  ],
  'Gastroenterologist': [
    { name: 'Dr. James Miller', hospital: 'Digestive Health Center', phone: '(555) 567-8901' },
    { name: 'Dr. Lisa Thompson', hospital: 'Memorial Hospital', phone: '(555) 678-9012' },
  ],
  'Neurologist': [
    { name: 'Dr. Robert Johnson', hospital: 'Neurology Associates', phone: '(555) 789-0123' },
    { name: 'Dr. Maria Garcia', hospital: 'Brain & Spine Center', phone: '(555) 890-1234' },
  ],
  'Orthopedist': [
    { name: 'Dr. Thomas Brown', hospital: 'Orthopedic Specialists', phone: '(555) 901-2345' },
    { name: 'Dr. Jennifer Lee', hospital: 'Sports Medicine Center', phone: '(555) 012-3456' },
  ],
  'ENT': [
    { name: 'Dr. Alexander Wright', hospital: 'Ear Nose & Throat Center', phone: '(555) 234-5678' },
    { name: 'Dr. Olivia Martinez', hospital: 'Head & Neck Institute', phone: '(555) 345-6789' },
  ],
  'Ophthalmologist': [
    { name: 'Dr. William Taylor', hospital: 'Vision Care Center', phone: '(555) 456-7890' },
    { name: 'Dr. Sophia Kim', hospital: 'Eye Institute', phone: '(555) 567-8901' },
  ],
  'Gynecologist': [
    { name: 'Dr. Patricia Adams', hospital: 'Women\'s Health Center', phone: '(555) 678-9012' },
    { name: 'Dr. Elizabeth Collins', hospital: 'OB/GYN Associates', phone: '(555) 789-0123' },
  ],
  'Urologist': [
    { name: 'Dr. Kevin Nelson', hospital: 'Urology Partners', phone: '(555) 890-1234' },
    { name: 'Dr. Steven White', hospital: 'Men\'s Health Institute', phone: '(555) 901-2345' },
  ],
  'Psychiatrist': [
    { name: 'Dr. Michelle Baker', hospital: 'Behavioral Health Center', phone: '(555) 012-3456' },
    { name: 'Dr. Jonathan Clark', hospital: 'Mind Wellness Clinic', phone: '(555) 123-4567' },
  ],
  'General Practitioner': [
    { name: 'Dr. Amanda Lewis', hospital: 'Community Health Clinic', phone: '(555) 987-6543' },
    { name: 'Dr. Daniel Morris', hospital: 'Family Medicine Associates', phone: '(555) 876-5432' },
    { name: 'Dr. Rebecca Jones', hospital: 'Primary Care Center', phone: '(555) 765-4321' },
  ]
};

// Check if message contains emergency symptoms
function checkForEmergency(message) {
  const lowercaseMessage = message.toLowerCase();
  return EMERGENCY_SYMPTOMS.some(symptom => lowercaseMessage.includes(symptom));
}

// Determine relevant medical specialty based on symptoms
function suggestSpecialty(message) {
  const lowercaseMessage = message.toLowerCase();
  for (const [specialty, keywords] of Object.entries(MEDICAL_SPECIALTIES)) {
    if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
      return specialty;
    }
  }
  // Default to general practitioner if no match
  return 'General Practitioner';
}

// Track the consultation stage for the AI
function determineConsultationStage(messages) {
  const userMessages = messages.filter(msg => msg.role === 'user');
  // If this is the first message, we're in the initial symptoms stage
  if (userMessages.length === 1) {
    return 'initial_symptoms';
  }
  
  // Look for common consultation progression indicators
  const allText = messages.map(msg => msg.content.toLowerCase()).join(' ');
  
  // Check for diagnostic progress
  const hasAskedAboutDuration = /how long|when did|started when|for how many|since when/.test(allText);
  const hasAskedAboutSeverity = /how (bad|severe|intense|painful)|rate (the|your) pain|scale of|from 1 to 10/.test(allText);
  const hasAskedAboutFactors = /(worse|better) when|triggers|alleviates|improves|worsens|affects/.test(allText);
  const hasAskedAboutHistory = /happened before|previous|history of|experienced this|in the past|recurring/.test(allText);
  const hasAskedAboutRelated = /other symptoms|anything else|also feeling|associated with|along with|accompanied by/.test(allText);
  
  // Check for analysis and conclusion indicators
  const hasProvidedAnalysis = /based on|it sounds like|this could be|possibly|might be|suggests/.test(allText);
  const hasProvidedRecommendation = /recommend|suggest|try|should|advise|best to/.test(allText);
  
  // Count how many different types of follow-up questions have been asked
  const followUpCount = [
    hasAskedAboutDuration,
    hasAskedAboutSeverity,
    hasAskedAboutFactors,
    hasAskedAboutHistory,
    hasAskedAboutRelated
  ].filter(Boolean).length;
  
  // Determine the stage based on the consultation patterns observed
  if (followUpCount >= 3 && hasProvidedRecommendation) {
    return 'conclusion';
  } else if (followUpCount >= 2 || hasProvidedAnalysis) {
    return 'analysis';
  } else if (followUpCount >= 1) {
    return 'detailed_investigation';
  } else {
    return 'follow_up';
  }
}

// Determine if conversation suggests a serious issue needing doctor referral
function needsDoctorReferral(messages) {
  const allText = messages.map(msg => msg.content.toLowerCase()).join(' ');
  
  // Check for indicators of severity
  const severityIndicators = [
    'severe pain', 'unbearable', 'excruciating', 'worst pain', 'cannot function',
    'getting worse', 'rapidly', 'suddenly', 'not improving', 'tried everything',
    'for weeks', 'for months', 'recurring', 'keeps coming back', 'interfering with life',
    'can\'t sleep', 'can\'t eat', 'can\'t work', 'debilitating'
  ];
  
  // Check for treatment resistance
  const treatmentResistance = [
    'not working', 'didn\'t help', 'no relief', 'still having', 'persists',
    'tried medication', 'took painkillers', 'nothing helps', 'despite'
  ];
  
  // Count indicators present in conversation
  const severityMatches = severityIndicators.filter(term => allText.includes(term)).length;
  const resistanceMatches = treatmentResistance.filter(term => allText.includes(term)).length;
  
  // Decision logic for doctor referral
  return (severityMatches >= 2) || (resistanceMatches >= 2) || (severityMatches >= 1 && resistanceMatches >= 1);
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Get last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) {
      return NextResponse.json({
        message: "Hello, I'm Dr. Wells. How can I help you today?"
      });
    }
    
    // Check for emergency first
    const isEmergency = checkForEmergency(lastUserMessage.content);
    if (isEmergency) {
      const emergencyResponse = "This is a medical emergency. Call 911 immediately or go to the nearest emergency room. Don't wait. If you're alone, call someone to help you. While waiting for emergency services: stay calm, loosen tight clothing, and if conscious, sit upright or in a position that makes breathing easier. Don't eat or drink anything.";
      
      return NextResponse.json({
        message: emergencyResponse,
        emergency: true
      });
    }
    
    // Determine the current stage of the medical consultation
    const consultationStage = determineConsultationStage(messages);
    
    // Check if we should recommend a doctor based on conversation
    const shouldRecommendDoctor = needsDoctorReferral(messages);
    
    // Create a system prompt that guides the AI to behave like a real doctor
    let systemPrompt = `You are Dr. Wells, a board-certified physician with 15 years of experience. You're known for your excellent bedside manner and clear communication. Respond exactly as a real doctor would in a clinical setting.
Current consultation stage: ${consultationStage}`;

    // Adjust the system prompt based on consultation stage
    switch(consultationStage) {
      case 'initial_symptoms':
        systemPrompt += `
During this initial symptoms stage:
- Begin with a brief professional greeting
- Acknowledge the patient's symptoms with appropriate concern
- Ask ONE targeted follow-up question about duration, severity, or specific location
- Use the clinical yet warm tone of an experienced physician
- Be concise and focused`;
        break;
        
      case 'follow_up':
        systemPrompt += `
During this follow-up stage:
- Briefly acknowledge their response
- Show you're building a clinical picture
- Ask ONE specific question about a different clinical aspect (e.g., factors affecting symptoms, related symptoms, medical history)
- Maintain professional medical tone
- Focus on gathering key diagnostic information`;
        break;
        
      case 'detailed_investigation':
        systemPrompt += `
During this detailed investigation stage:
- Very briefly note the information gathered so far
- Ask ONE specific clinical question to clarify important details
- Show clinical reasoning in your approach
- Focus on factors that would influence your differential diagnosis
- Maintain the authoritative yet approachable tone of an experienced physician`;
        break;
        
      case 'analysis':
        systemPrompt += `
During this analysis stage:
- Provide an initial clinical assessment based on the information gathered
- Show your medical reasoning process clearly
- For minor conditions, suggest an evidence-based approach
- For more concerning conditions, ask ONE final clarifying question
- Project clinical confidence and expertise`;
        break;
        
      case 'conclusion':
        systemPrompt += `
During this conclusion stage:
- Deliver a clear clinical assessment
- Provide specific medical recommendations and treatment plan
- Explain likely etiology in accessible but accurate terms
- Give clear guidance on when symptoms would warrant further attention
- Close with professional reassurance`;
        break;
    }

    // Get response from Groq AI
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 450,
    });
    
    let aiResponse = completion.choices[0].message.content;

    // Add emergency number for critical situations
    if (aiResponse.toLowerCase().includes("emergency") || aiResponse.toLowerCase().includes("urgent care") || aiResponse.toLowerCase().includes("hospital immediately")) {
      aiResponse += "\n\nEmergency Services: 112";
    }

    // Add doctor recommendation at conclusion stage if needed
    if (consultationStage === 'conclusion' && shouldRecommendDoctor) {
      // Determine the appropriate specialty to recommend
      const recommendedSpecialty = suggestSpecialty(messages.map(msg => msg.content).join(' '));
      const doctors = LOCAL_DOCTORS[recommendedSpecialty] || LOCAL_DOCTORS['General Practitioner'];
      
      // Add doctor recommendation to the response
      const doctorInfo = `\n\nI recommend you schedule an appointment with a ${recommendedSpecialty}. Here are some specialists in your area:\n• ${doctors[0].name} at ${doctors[0].hospital}, ${doctors[0].phone}\n• ${doctors[1].name} at ${doctors[1].hospital}, ${doctors[1].phone}`;
      
      aiResponse += doctorInfo;
    }

    // Return the AI response
    return NextResponse.json({
      message: aiResponse,
      emergency: isEmergency,
      stage: consultationStage,
      referral: consultationStage === 'conclusion' && shouldRecommendDoctor
    });
    
  } catch (error) {
    console.error('Error in medical API:', error);
    return NextResponse.json(
      { message: "I apologize for the interruption. Let's continue our consultation. What were you telling me about your symptoms?" },
      { status: 500 }
    );
  }
}