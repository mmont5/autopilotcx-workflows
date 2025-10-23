CURRENT CODE:

/**
 * MEDICAL INFO COLLECTOR MODULE
 * Handles: Location, pain level, symptoms, service selection
 * States: waiting_for_location, waiting_for_pain_level, waiting_for_symptoms, waiting_for_service_selection
 */

// Get input data
let inputData;
try {
  inputData = $input.all();
} catch (e) {
  inputData = [{
    json: {
      message: 'Old Bridge',
      bookingState: 'waiting_for_location',
      bookingData: { firstName: 'John', lastName: 'Smith', email: 'john@test.com' },
      demoContext: { services: ['Spinal Conditions', 'Sports Medicine'] }
    }
  }];
}

const item = inputData[0].json;
const message = item.message || '';
const bookingState = item.bookingState || 'waiting_for_location';
const bookingData = item.bookingData || {};
const demoContext = item.demoContext || {};

let response = '';
let nextState = bookingState;
let collectedData = { ...bookingData };
let highlightedText = [];
let quickActions = [];

console.log('🏥 MEDICAL INFO COLLECTOR:', { bookingState, message });

// Utility functions
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function parseIfString(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.log('Failed to parse JSON:', e);
      return [];
    }
  }
  return data;
}

function spellCheckMedicalTerms(text) {
  const medicalTermCorrections = {
    // Body parts
    'sholder': 'shoulder', 'sholders': 'shoulders',
    'kne': 'knee', 'knea': 'knee',
    'bak': 'back', 'bakc': 'back',
    'nek': 'neck', 'nec': 'neck',
    'hed': 'head', 'haed': 'head',
    'stomache': 'stomach', 'stomac': 'stomach',
    'cheast': 'chest', 'ches': 'chest',
    'ankel': 'ankle', 'ancle': 'ankle',
    'wrist': 'wrist', 'wris': 'wrist',

    // Symptoms
    'painfull': 'painful', 'panful': 'painful',
    'dizzy': 'dizzy', 'dizy': 'dizzy',
    'nausia': 'nausea', 'nausea': 'nausea',
    'hedache': 'headache', 'headach': 'headache',
    'fatigue': 'fatigue', 'fatige': 'fatigue',
    'sweling': 'swelling', 'swelling': 'swelling',
    'numbnes': 'numbness', 'numness': 'numbness',
    'brething': 'breathing', 'breathng': 'breathing',

    // Common medical terms
    'apointment': 'appointment', 'appointemnt': 'appointment',
    'insurence': 'insurance', 'insuranse': 'insurance',
    'perscription': 'prescription', 'presciption': 'prescription',
    'medicne': 'medicine', 'medecine': 'medicine',
    'surgery': 'surgery', 'surgary': 'surgery',
    'injurie': 'injury', 'ingury': 'injury',
    'treatement': 'treatment', 'tretment': 'treatment'
  };

  let corrected = text.toLowerCase();

  // Replace each misspelling with correct spelling
  Object.keys(medicalTermCorrections).forEach(misspelling => {
    const regex = new RegExp(`\\b${misspelling}\\b`, 'gi');
    corrected = corrected.replace(regex, medicalTermCorrections[misspelling]);
  });

  return corrected;
}

function validatePainLevel(input) {
  const painLevel = parseInt(input);
  return !isNaN(painLevel) && painLevel >= 1 && painLevel <= 10;
}

// STATE HANDLERS
switch (bookingState) {

  case 'waiting_for_location':
    // Proactive location prompt when entering state with empty message
    if (!message || message.trim() === '') {
      const locationPromptResponses = [
        `Thank you. Which of our locations would be most convenient for you?`,
        `Perfect. Which location would work best for your appointment?`,
        `Great. Which location would you prefer to visit?`,
        `Thank you. Which of our locations would you like to visit?`
      ];

      response = getRandomResponse(locationPromptResponses);
      nextState = 'waiting_for_location';
      highlightedText = ['locations', 'location'];

      // Add location buttons
      const locations = parseIfString(demoContext.locations || []);
      if (Array.isArray(locations) && locations.length > 0) {
        quickActions = locations.map(loc => ({
          text: loc.city || loc.name || loc,
          action: loc.city || loc.name || loc
        }));
      } else {
        quickActions = [];
      }
    } else {
      // Process location selection
      collectedData.location = message;

      const painLevelResponses = [
        `Perfect. I have your location as ${message}. Could you please rate your current pain level on a scale of 1 to 10, with 10 being the most severe?`,
        `Thank you. May I ask you to rate your pain on a scale of 1 to 10?`,
        `Great. I have ${message}. Could you please rate your pain from 1 to 10, with 10 being the most severe?`,
        `Perfect. May I please have your pain level on a scale of 1 to 10?`
      ];

      response = getRandomResponse(painLevelResponses);
      nextState = 'waiting_for_pain_level';
      highlightedText = ['1 to 10', 'scale of 1 to 10'];

      // Pain level buttons 1-10
      quickActions = Array.from({length: 10}, (_, i) => ({
        text: `${i + 1}`,
        action: `${i + 1}`
      }));
    }
    break;

  case 'waiting_for_pain_level':
    if (validatePainLevel(message)) {
      const painLevel = parseInt(message);
      collectedData.painLevel = painLevel;

      // Empathetic response based on pain level
      let empathyResponse = '';
      if (painLevel >= 8) {
        empathyResponse = `I'm so sorry to hear you're experiencing such severe discomfort. I want you to know that we're here to help you, and we'll do everything we can to get you the care you need as quickly as possible. `;
      } else if (painLevel >= 5) {
        empathyResponse = `I understand you're dealing with significant pain, and I want to assure you that we're committed to helping you feel better. `;
      } else {
        empathyResponse = `Thank you for sharing that with me. I appreciate you providing this information. `;
      }

      const symptomsResponses = [
        `${empathyResponse}Could you please describe your symptoms in a bit more detail? This will help us provide you with the best possible care.`,
        `${empathyResponse}May I ask you to share more about your symptoms? Any details you can provide will be very helpful for your appointment.`,
        `${empathyResponse}Could you tell me more about your symptoms? This information is important to ensure we're fully prepared for your visit.`,
        `${empathyResponse}Would you mind describing your symptoms in more detail? The more we know, the better we can help you.`,
        `${empathyResponse}May I please have a more detailed description of your symptoms? This will help us give you the best care possible.`,
        `${empathyResponse}Could you share more about your symptoms with me? Any additional information will be valuable for your appointment.`,
        `${empathyResponse}Would you please describe your symptoms in more detail? This helps us prepare to give you excellent care.`,
        `${empathyResponse}May I ask for more information about your symptoms? The details you provide will help us serve you better.`,
        `${empathyResponse}Could you tell me more about your symptoms? This information is very important for your visit.`,
        `${empathyResponse}Would you mind sharing more details about your symptoms? This will help us ensure you receive the best possible care.`
      ];

      response = getRandomResponse(symptomsResponses);
      nextState = 'waiting_for_symptoms';
      highlightedText = ['symptoms'];
      quickActions = [];
    } else {
      const painClarificationResponses = [
        `I want to make sure I understand your pain level correctly. Could you please provide a number from 1 to 10 to describe your pain? For example, 1 is minimal pain and 10 is the most severe.`,
        `To ensure accuracy, may I please have a pain rating from 1 (minimal pain) to 10 (most severe pain)?`,
        `I'd like to make certain I get this right. Could you please rate your pain on a scale of 1 to 10, where 1 is very mild and 10 is extremely severe?`,
        `Thank you for your patience. May I please have a number from 1 to 10 that represents your current pain level?`,
        `To make sure I record this correctly, could you please provide a pain level between 1 and 10? 1 means minimal pain, and 10 means the worst pain.`,
        `I want to ensure we understand your pain level. May I please have a rating from 1 (very mild) to 10 (extremely severe)?`,
        `Thank you! To continue, could you please share a number from 1 to 10 that describes your pain level?`,
        `I appreciate your understanding. May I please have a valid pain rating between 1 and 10?`,
        `To make certain I get this right, could you please provide a number from 1 to 10 to rate your pain?`,
        `Thank you for your patience. May I please have a pain level from 1 (minimal) to 10 (most severe)?`
      ];

      response = getRandomResponse(painClarificationResponses);
      nextState = 'waiting_for_pain_level';
      highlightedText = ['1 and 10', '1 to 10'];

      // Re-show pain level buttons
      quickActions = Array.from({length: 10}, (_, i) => ({
        text: `${i + 1}`,
        action: `${i + 1}`
      }));
    }
    break;

  case 'waiting_for_symptoms':
    if (message.length < 10) {
      const symptomsClarificationResponses = [
        `I want to make sure we have all the information we need to help you. Could you please provide a bit more detail about your symptoms?`,
        `To ensure we're fully prepared for your visit, may I ask for a more detailed description of what you're experiencing?`,
        `I'd like to make certain we understand your situation completely. Could you describe your symptoms in more detail?`,
        `Thank you! To help us give you the best care, could you please share more details about what you're experiencing?`,
        `I appreciate you sharing that. May I ask for a bit more information about your symptoms to ensure we can help you properly?`,
        `To make sure we're ready to assist you, could you please provide more details about what you're going through?`,
        `I want to ensure we understand your needs fully. May I please have a more detailed description of your symptoms?`,
        `Thank you for that information. Could you share a bit more about what you're experiencing so we can prepare for your visit?`,
        `To help us provide you with excellent care, may I ask for more details about your symptoms?`,
        `I appreciate you sharing with me. Could you please describe your symptoms in a bit more detail?`
      ];

      response = getRandomResponse(symptomsClarificationResponses);
      nextState = 'waiting_for_symptoms';
      highlightedText = ['more detail'];
      quickActions = [];
    } else {
      // Apply spell-checking to symptoms
      collectedData.symptoms = spellCheckMedicalTerms(message);

      const serviceResponses = [
        `Thank you for sharing those details. Which service or procedure are you interested in?`,
        `Thank you. What type of service would you like to schedule?`,
        `Perfect. Which of our services would best address your needs?`,
        `Thank you. Which service or procedure would you like to schedule?`
      ];

      response = getRandomResponse(serviceResponses);
      nextState = 'waiting_for_service_selection';
      highlightedText = ['service', 'procedure'];

      // Service buttons (top 5 + "Other")
      const services = parseIfString(demoContext.services || demoContext.allServices || []);
      if (Array.isArray(services)) {
        const displayServices = services.slice(0, 5);
        quickActions = displayServices.map(service => ({
          text: service,
          action: service
        }));

        if (services.length > 5) {
          quickActions.push({ text: 'Other', action: 'other' });
        }
      } else {
        quickActions = [];
      }
    }
    break;

  case 'waiting_for_service_selection':
    if (message.toLowerCase() === 'other') {
      const otherServiceResponses = [
        `Of course! Please describe the service or procedure you're interested in, and I'll be happy to help you with that.`,
        `Certainly! Could you please tell me which service or procedure you'd like to schedule?`,
        `I'd be glad to help with that. Please share which service or procedure you're interested in.`,
        `Absolutely! May I please know which service or procedure you're looking for?`,
        `Of course! I'm here to help. Please describe the service or procedure you need.`,
        `Certainly! Could you please share which service or procedure you'd like to book?`,
        `I'd be happy to assist with that. Please tell me which service or procedure you're interested in.`,
        `Absolutely! May I ask which service or procedure you're looking to schedule?`,
        `Of course! Please let me know which service or procedure you need.`,
        `Certainly! I'm here to help. Could you please describe the service or procedure you'd like?`
      ];

      response = getRandomResponse(otherServiceResponses);
      nextState = 'waiting_for_service_selection';
      highlightedText = [];
      quickActions = [];
    } else {
      collectedData.procedure = message;
      collectedData.service = message;

      const insuranceResponses = [
        `Perfect. I have ${message} noted. Do you have insurance coverage?`,
        `Thank you. May I ask if you have health insurance you'd like to use?`,
        `Great. I have ${message} noted. Do you have insurance coverage?`,
        `Perfect. Do you have health insurance for this appointment?`
      ];

      response = getRandomResponse(insuranceResponses);
      nextState = 'waiting_for_insurance';
      highlightedText = ['insurance'];

      // Insurance provider buttons
      const insuranceProviders = parseIfString(demoContext.insurance_providers || demoContext.insuranceProviders || []);
      if (Array.isArray(insuranceProviders) && insuranceProviders.length > 0) {
        quickActions = insuranceProviders.map(provider => ({
          text: typeof provider === 'string' ? provider : (provider.name || provider),
          action: typeof provider === 'string' ? provider : (provider.name || provider)
        }));
        quickActions.push({ text: 'No Insurance', action: 'none' });
      } else {
        quickActions = [
          { text: 'Yes', action: 'yes' },
          { text: 'No', action: 'none' }
        ];
      }
    }
    break;

  default:
    response = `Let me help you with your medical information.`;
    nextState = 'waiting_for_location';
    break;
}

// 🚨 FIX: Store timestamp as ISO string in variable
const currentTimestamp = new Date().toISOString();

// Return response data
return {
  json: {
    message: response,
    currentState: nextState,
    bookingState: nextState,
    collectedData: collectedData,
    bookingData: collectedData,
    highlightedText: highlightedText,
    quickActions: quickActions,
    demoContext: demoContext,
    timestamp: currentTimestamp,  // ✅ ISO string (not Date object)
    module: 'medical-info-collector'
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
};