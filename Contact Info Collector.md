CURRENT CODE:

/**
 * CONTACT INFO COLLECTOR MODULE
 * Handles: Phone number and email validation and collection
 * States: waiting_for_phone, waiting_for_email
 */

// Get input data
let inputData;
try {
  inputData = $input.all();
} catch (e) {
  inputData = [{
    json: {
      message: '5038041234',
      bookingState: 'waiting_for_phone',
      bookingData: { firstName: 'John', lastName: 'Smith', dateOfBirth: '01/15/1990' },
      demoContext: {}
    }
  }];
}

const item = inputData[0].json;
const message = item.message || '';
const bookingState = item.bookingState || 'waiting_for_phone';
const bookingData = item.bookingData || {};
const demoContext = item.demoContext || {};

let response = '';
let nextState = bookingState;
let collectedData = { ...bookingData };
let highlightedText = [];
let quickActions = [];

console.log('📞 CONTACT INFO COLLECTOR:', { bookingState, message });

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

// Phone validation
function validatePhone(input) {
  const phonePattern = /^(\+?1[-.]?)?(\()?([0-9]{3})(\))?[-.]?([0-9]{3})[-.]?([0-9]{4})$|^([0-9]{10})$/;
  const cleanMessage = input.replace(/[\s\-\(\)\.]/g, '');
  return phonePattern.test(cleanMessage);
}

function formatPhone(input) {
  const cleanMessage = input.replace(/[\s\-\(\)\.]/g, '');
  let formattedPhone = cleanMessage;

  if (cleanMessage.length === 10) {
    formattedPhone = `+1${cleanMessage}`;
  } else if (cleanMessage.startsWith('1') && cleanMessage.length === 11) {
    formattedPhone = `+${cleanMessage}`;
  } else if (cleanMessage.startsWith('+1')) {
    formattedPhone = cleanMessage;
  } else if (cleanMessage.startsWith('+') && cleanMessage.length === 12) {
    formattedPhone = cleanMessage;
  } else {
    formattedPhone = `+1${cleanMessage.replace(/^\+?1?/, '')}`;
  }

  return formattedPhone;
}

// Email validation
function validateEmail(input) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(input);
}

function correctCommonEmailDomains(email) {
  const commonDomains = {
    // Gmail variations
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'g mail.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'gmil.com': 'gmail.com',

    // Yahoo variations
    'yahooo.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yhaoo.com': 'yahoo.com',
    'yahho.com': 'yahoo.com',

    // Hotmail variations
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmil.com': 'hotmail.com',
    'hot mail.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',

    // Outlook variations
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'outlook.con': 'outlook.com',

    // Other common providers
    'aol.con': 'aol.com',
    'alo.com': 'aol.com',
    'icloud.con': 'icloud.com',
    'iclod.com': 'icloud.com',
    'icoud.com': 'icloud.com'
  };

  const parts = email.split('@');
  if (parts.length === 2) {
    const domain = parts[1].toLowerCase();
    if (commonDomains[domain]) {
      return `${parts[0]}@${commonDomains[domain]}`;
    }
  }

  return email;
}

// STATE HANDLERS
switch (bookingState) {

  case 'waiting_for_phone':
    if (validatePhone(message)) {
      const formattedPhone = formatPhone(message);
      collectedData.phoneNumber = formattedPhone;
      collectedData.phone = formattedPhone;

      const emailResponses = [
        `Perfect. I have your phone number. May I please have your email address?`,
        `Thank you. Could you please share your email address?`,
        `Great. I have your phone number noted. May I please have your email address?`,
        `Perfect. Could you please provide your email address?`
      ];

      response = getRandomResponse(emailResponses);
      nextState = 'waiting_for_email';
      highlightedText = ['email address'];
      quickActions = [];
    } else {
      const phoneClarificationResponses = [
        `I want to make sure I have the correct phone number. Could you please provide your 10-digit phone number? For example: 503-804-1234`,
        `To ensure accuracy, may I please have a valid phone number? Example: (503) 804-1234`,
        `I'd like to make certain I get your number right. Could you please share a valid phone number? Example: 5038041234`,
        `Thank you for your patience. May I please have a valid 10-digit phone number? For example: 503-804-1234`
      ];

      response = getRandomResponse(phoneClarificationResponses);
      nextState = 'waiting_for_phone';
      highlightedText = ['valid phone number'];
      quickActions = [];
    }
    break;

  case 'waiting_for_email':
    const correctedEmail = correctCommonEmailDomains(message);

    if (validateEmail(correctedEmail)) {
      collectedData.email = correctedEmail.toLowerCase();

      const locationResponses = [
        `Perfect! I have your email address. Thank you so much. Now, which of our locations would be most convenient for you to visit?`,
        `Excellent! Your email is recorded. Thank you. Which location would you prefer for your appointment?`,
        `Thank you! I've got your email address. May I ask which of our locations would be most convenient for you?`,
        `Great! I have your email noted. Which location would work best for you?`
      ];

      response = getRandomResponse(locationResponses);
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
      const emailClarificationResponses = [
        `I want to make sure I have your email address correct. Could you please provide a valid email address? For example: john.doe@example.com`,
        `To ensure accuracy, may I please have a valid email address? Example: jane.smith@gmail.com`,
        `I'd like to make certain I get this right. Could you please share a valid email address? For example: michael@yahoo.com`,
        `Thank you for your patience. May I please have a valid email address? Example: john.doe@example.com`,
        `To make sure I record this correctly, could you please provide a valid email address? For example: jane.smith@gmail.com`,
        `I want to ensure we can reach you. May I please have a valid email address? Example: michael@yahoo.com`,
        `Thank you! To continue, could you please share a valid email address? For example: john.doe@example.com`,
        `I appreciate your understanding. May I please have a valid email address? Example: jane.smith@gmail.com`,
        `To make certain I can contact you, could you please provide a valid email address? For example: michael@yahoo.com`,
        `Thank you for your patience. May I please have a valid email address? Example: john.doe@example.com`
      ];

      response = getRandomResponse(emailClarificationResponses);
      nextState = 'waiting_for_email';
      highlightedText = ['valid email address'];
      quickActions = [];
    }
    break;

  default:
    response = `Let me help you with your contact information.`;
    nextState = 'waiting_for_phone';
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
    module: 'contact-info-collector'
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
};