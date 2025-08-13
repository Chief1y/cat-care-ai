export interface ThinkingStep {
  message: string;
  duration: number;
}

export interface AIResponse {
  text: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  recommendations: string[];
  requiresDoctor?: boolean;
  doctorInfo?: {
    id: number;
    name: string;
    specialty: string;
    location: string;
    rating: number;
  };
}

export class SmartVetAI {
  // Thinking animation steps
  private static readonly THINKING_STEPS: ThinkingStep[] = [
    { message: "🧠 Analyzing symptoms...", duration: 1800 },
    { message: "🔍 Searching database...", duration: 1500 },
    { message: "📋 Preparing recommendations...", duration: 1200 },
    { message: "🎯 Finalizing assessment...", duration: 1000 }
  ];

  // Doctor search animation steps
  private static readonly DOCTOR_SEARCH_STEPS: ThinkingStep[] = [
    { message: "🔍 Symptoms require specialist consultation...", duration: 1500 },
    { message: "👨‍⚕️ Searching available doctors...", duration: 1800 },
    { message: "📍 Matching specialists in your area...", duration: 1600 },
    { message: "⭐ Found top-rated specialist...", duration: 1200 }
  ];

  // Available doctors database
  private static readonly AVAILABLE_DOCTORS = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Feline Internal Medicine', location: 'New York, USA', rating: 4.9 },
    { id: 2, name: 'Dr. Hiroshi Tanaka', specialty: 'Veterinary Surgery', location: 'Tokyo, Japan', rating: 4.8 },
    { id: 3, name: 'Dr. Emma Wilson', specialty: 'Emergency Pet Care', location: 'London, UK', rating: 4.7 },
    { id: 4, name: 'Dr. Marco Silva', specialty: 'Cat Behavior', location: 'São Paulo, Brazil', rating: 4.9 },
    { id: 5, name: 'Dr. Anna Mueller', specialty: 'Feline Cardiology', location: 'Berlin, Germany', rating: 4.8 },
  ];

  // 4 key situations with sophisticated responses
  private static readonly RESPONSE_PATTERNS = {
    // Situation 1: Not eating
    'not eating': {
      keywords: ['not eating', 'won\'t eat', 'loss appetite', 'appetite loss', 'refusing food', 'no appetite'],
      responses: [
        {
          text: "Based on my analysis of 47,000+ feline cases, appetite loss lasting over 24 hours requires immediate attention. I've identified 3 potential causes: dental pain (42% probability), gastrointestinal issues (31%), or stress-related factors (27%). I'm detecting this as a medium-priority case requiring professional evaluation within 6 hours.",
          confidence: 87,
          urgency: 'medium' as const,
          recommendations: [
            "Schedule vet appointment within 6 hours",
            "Monitor for additional symptoms",
            "Ensure fresh water access",
            "Avoid forcing food consumption"
          ]
        },
        {
          text: "Cross-referencing your cat's symptoms with our veterinary AI database... This pattern appears in 1,247 recent cases. My assessment indicates potential underlying conditions that warrant professional examination. I'm connecting you with Dr. Sarah Johnson, our feline nutrition specialist, who has 94% success rate with appetite disorders.",
          confidence: 91,
          urgency: 'medium' as const,
          recommendations: [
            "Immediate vet consultation recommended",
            "Document eating patterns for 24h",
            "Check for dental sensitivity",
            "Consider stress factors in environment"
          ]
        }
      ]
    },

    // Situation 2: Vomiting episodes
    'vomiting episodes': {
      keywords: ['vomiting', 'throwing up', 'vomit', 'sick', 'puking', 'nausea'],
      responses: [
        {
          text: "Emergency protocol activated. My AI analysis shows vomiting patterns consistent with 2,890 cases in our database. This presents as a high-priority situation requiring immediate evaluation. I'm calculating a 78% probability of gastrointestinal distress and 22% chance of toxin exposure. Emergency services are recommended within 2 hours.",
          confidence: 93,
          urgency: 'high' as const,
          recommendations: [
            "Seek emergency veterinary care immediately",
            "Remove food and water access temporarily",
            "Monitor for dehydration signs",
            "Document vomiting frequency and content"
          ]
        },
        {
          text: "Processing digestive emergency data... My analysis indicates this symptom cluster appears in 15.3% of urgent cases. I'm detecting patterns suggesting immediate veterinary intervention is required. Based on 12,000+ similar cases, this condition has 89% positive outcomes with prompt treatment.",
          confidence: 89,
          urgency: 'emergency' as const,
          recommendations: [
            "Emergency vet visit required NOW",
            "Bring vomit sample if possible",
            "List recent dietary changes",
            "Prepare medical history summary"
          ]
        }
      ]
    },

    // Situation 3: Breathing difficulty
    'breathing difficulty': {
      keywords: ['breathing', 'breath', 'wheezing', 'panting', 'gasping', 'respiratory'],
      responses: [
        {
          text: "CRITICAL ALERT: My AI diagnostic system has flagged respiratory distress as an emergency condition. Cross-referencing with 8,400+ respiratory cases shows 96% require immediate intervention. I'm activating emergency protocols and locating the nearest 24/7 veterinary facility. This is classified as life-threatening priority.",
          confidence: 96,
          urgency: 'emergency' as const,
          recommendations: [
            "EMERGENCY: Get to vet hospital NOW",
            "Keep cat calm during transport",
            "Ensure good ventilation in carrier",
            "Call ahead to prepare emergency team"
          ]
        },
        {
          text: "Emergency respiratory assessment completed. My AI analysis shows this symptom pattern in 0.8% of cases - all requiring immediate care. I'm connecting you with emergency services and preparing Dr. Martinez (cardiopulmonary specialist) for immediate consultation. Time is critical for optimal outcomes.",
          confidence: 98,
          urgency: 'emergency' as const,
          recommendations: [
            "URGENT: Emergency vet immediately",
            "Monitor breathing rate continuously",
            "Avoid stress or exertion",
            "Transport in well-ventilated carrier"
          ]
        }
      ]
    },

    // Situation 4: Behavioral changes
    'behavioral changes': {
      keywords: ['hiding', 'aggressive', 'lethargic', 'withdrawn', 'behavior', 'acting strange'],
      responses: [
        {
          text: "My behavioral analysis engine has processed your cat's symptoms against 23,000+ behavioral health cases. I'm detecting a 73% correlation with underlying medical conditions. Behavioral changes often indicate pain or discomfort that cats instinctively hide. This warrants professional evaluation within 24-48 hours.",
          confidence: 81,
          urgency: 'medium' as const,
          recommendations: [
            "Schedule veterinary behavioral assessment",
            "Monitor eating and litter habits",
            "Document specific behavioral changes",
            "Consider environmental stress factors"
          ]
        },
        {
          text: "Advanced behavioral pattern recognition activated... I'm analyzing your cat's symptoms through our feline psychology database. This behavior profile appears in 4,200+ cases, with 67% indicating underlying health issues. My recommendation engine suggests Dr. Chen Wei, our animal behaviorist, for comprehensive evaluation.",
          confidence: 84,
          urgency: 'low' as const,
          recommendations: [
            "Behavioral assessment recommended",
            "Track daily activity patterns",
            "Review recent environmental changes",
            "Consider stress reduction strategies"
          ]
        }
      ]
    }
  };

  // Default responses for unmatched queries
  private static readonly DEFAULT_RESPONSES = [
    {
      text: "I'm analyzing your inquiry through our comprehensive veterinary AI system... Based on preliminary assessment, I recommend consulting with one of our 2,400+ certified veterinarians for personalized guidance. Would you like me to connect you with a specialist in your area?",
      confidence: 75,
      urgency: 'low' as const,
      recommendations: [
        "Consult with local veterinarian",
        "Monitor symptoms closely",
        "Document any changes",
        "Ensure regular health checkups"
      ]
    },
    {
      text: "Processing your cat health inquiry... My AI diagnostic system is cross-referencing your input with our extensive medical database. For the most accurate assessment, I recommend scheduling a consultation with one of our verified veterinary professionals. Shall I locate specialists in your area?",
      confidence: 78,
      urgency: 'low' as const,
      recommendations: [
        "Professional veterinary consultation",
        "Regular health monitoring",
        "Maintain vaccination schedule",
        "Consider preventive care options"
      ]
    },
    // Enhanced edge case requiring doctor consultation
    {
      text: "My diagnostic algorithms indicate this symptom pattern requires specialized veterinary evaluation that goes beyond my current analysis capabilities. I'm unable to provide a confident assessment without physical examination. Let me connect you with a qualified veterinarian who can provide the expert care your cat needs.",
      confidence: 60,
      urgency: 'medium' as const,
      requiresDoctor: true,
      recommendations: [
        "Immediate veterinary consultation required",
        "Prepare list of symptoms and timeline",
        "Bring medical history if available",
        "Schedule appointment within 24 hours"
      ]
    }
  ];

  static async processMessage(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Find matching pattern
    for (const [situation, data] of Object.entries(this.RESPONSE_PATTERNS)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        return randomResponse;
      }
    }

    // Return default response if no pattern matches
    // Always trigger the doctor consultation for unmatched queries (since they may be serious)
    const shouldRequireDoctor = true; // Changed from Math.random() < 0.3
    
    if (shouldRequireDoctor) {
      const doctorResponse = this.DEFAULT_RESPONSES.find(r => r.requiresDoctor);
      if (doctorResponse) {
        // Select random doctor
        const randomDoctor = this.AVAILABLE_DOCTORS[Math.floor(Math.random() * this.AVAILABLE_DOCTORS.length)];
        return {
          ...doctorResponse,
          doctorInfo: randomDoctor
        };
      }
    }
    
    const randomDefault = this.DEFAULT_RESPONSES[Math.floor(Math.random() * this.DEFAULT_RESPONSES.length)];
    return randomDefault;
  }

  static getDoctorSearchSteps(): ThinkingStep[] {
    return [...this.DOCTOR_SEARCH_STEPS];
  }

  static getThinkingSteps(): ThinkingStep[] {
    return [...this.THINKING_STEPS];
  }

  static async simulateThinking(onStep: (step: string) => void): Promise<void> {
    for (const step of this.THINKING_STEPS) {
      onStep(step.message);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }

  static async simulateDoctorSearch(onStep: (step: string) => void): Promise<void> {
    for (const step of this.DOCTOR_SEARCH_STEPS) {
      onStep(step.message);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }
}
