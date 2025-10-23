CURRENT CODE:

/**
 * PATIENT INFO COLLECTOR MODULE
 * Handles: Initial booking request, patient type, name, date of birth, phone
 * States: initial, waiting_for_patient_type, waiting_for_name, waiting_for_dob, waiting_for_phone
 */

// Get input data
let inputData;
try {
  inputData = $input.all();
} catch (e) {
  inputData = [{
    json: {
      message: 'I want to schedule an appointment',
      bookingState: 'initial',
      bookingData: {},
      demoContext: {}
    }
  }];
}

const item = inputData[0].json;
const message = item.message || '';
const bookingState = item.bookingState || 'initial';
const bookingData = item.bookingData || {};
const demoContext = item.demoContext || {};

let response = '';
let nextState = bookingState;
let collectedData = { ...bookingData };
let highlightedText = [];
let quickActions = [];

console.log('👤 PATIENT INFO COLLECTOR:', { bookingState, message });

// Utility functions
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function validateFullName(input) {
  const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
  return nameMatch !== null;
}

function capitalizeFirstLetter(str) {
  // Common name spelling corrections (basic spell-check)
  const commonNameCorrections = {
    'jogn': 'john',
    'jhon': 'john',
    'jon': 'john',
    'jame': 'james',
    'micheal': 'michael',
    'michale': 'michael',
    'sarah': 'sara',
    'sara': 'sarah',
    'smtih': 'smith',
    'smit': 'smith',
    'jhonson': 'johnson',
    'willam': 'william',
    'willams': 'williams',
    'jhones': 'jones',
    'jhonson': 'johnson',
    'davids': 'david',
    'rober': 'robert',
    'robert': 'robert',
    'maichael': 'michael',
    'chritopher': 'christopher',
    'christoper': 'christopher'
  };

  const lowerStr = str.toLowerCase();
  const corrected = commonNameCorrections[lowerStr] || lowerStr;
  return corrected.charAt(0).toUpperCase() + corrected.slice(1);
}

function validateDateOfBirth(input) {
  const datePatterns = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/
  ];
  for (let pattern of datePatterns) {
    if (input.match(pattern)) return true;
  }
  return false;
}

function formatDateOfBirth(input) {
  const slashMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const month = slashMatch[1].padStart(2, '0');
    const day = slashMatch[2].padStart(2, '0');
    return `${month}/${day}/${slashMatch[3]}`;
  }
  const dashMatch = input.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashMatch) {
    const month = dashMatch[1].padStart(2, '0');
    const day = dashMatch[2].padStart(2, '0');
    return `${month}/${day}/${dashMatch[3]}`;
  }
  return input;
}

// STATE HANDLERS
switch (bookingState) {

  case 'initial':
    const bookingKeywords = ['appointment', 'schedule', 'book', 'visit', 'consultation', 'booking'];
    const isBookingRequest = bookingKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (isBookingRequest) {
      const patientTypeResponses = [
        `I'm happy to help you schedule your appointment. Are you a new patient or an existing patient with us?`,
        `I'd be glad to assist you with scheduling. Are you a new patient or an existing patient?`,
        `I'm here to help you get your appointment scheduled. Are you a new patient or have you visited us before?`,
        `I'm happy to help you schedule your appointment. Are you a new patient or an existing patient?`,
        `I'd be glad to assist you with scheduling. Are you a new patient or are you already a patient with us?`,
        `I'm here to help you schedule your appointment. Are you a new patient or an existing patient?`
      ];

      response = getRandomResponse(patientTypeResponses);
      nextState = 'waiting_for_patient_type';
      highlightedText = ['new patient', 'existing patient'];
      quickActions = [
        { text: 'New Patient', action: 'new' },
        { text: 'Existing Patient', action: 'existing' }
      ];
    } else {
      response = `Hello! How may I help you today?`;
      nextState = 'initial';
    }
    break;

  case 'waiting_for_patient_type':
    const patientType = message.toLowerCase().includes('new') ? 'new' :
                       message.toLowerCase().includes('existing') ? 'existing' :
                       message;

    collectedData.patientType = patientType;

    const nameResponses = [
      `Thank you. May I please have your first name and last name?`,
      `Perfect. Could you please share your first name and last name?`,
      `Thank you. May I please have your first name and last name?`,
      `Great. Could you please provide your first name and last name?`
    ];

    response = getRandomResponse(nameResponses);
    nextState = 'waiting_for_name';
    highlightedText = ['first name', 'last name'];
    quickActions = [];
    break;

  case 'waiting_for_name':
    if (validateFullName(message)) {
      const nameMatch = message.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
      const firstName = capitalizeFirstLetter(nameMatch[1]);
      const lastName = capitalizeFirstLetter(nameMatch[2]);

      collectedData.firstName = firstName;
      collectedData.lastName = lastName;
      collectedData.patientName = `${firstName} ${lastName}`;

      const dobResponses = [
        `Thank you, ${firstName}. It's nice to meet you. May I please have your date of birth in MM/DD/YYYY format?`,
        `Perfect. I have ${firstName} ${lastName}. Could you please share your date of birth? (MM/DD/YYYY)`,
        `Thank you, ${firstName}. May I please have your date of birth? (Example: 03/15/1985)`,
        `Great. I have ${firstName} ${lastName}. Could you please provide your date of birth in MM/DD/YYYY format?`
      ];

      response = getRandomResponse(dobResponses);
      nextState = 'waiting_for_dob';
      highlightedText = ['date of birth', 'MM/DD/YYYY'];
      quickActions = [];
    } else {
      const nameClarificationResponses = [
        `I want to make sure I get your name exactly right. Could you please provide your first name and last name? For example: John Smith`,
        `To ensure accuracy, may I please have your first name and last name? Example: John Smith`,
        `I'd like to make certain I have your name correct. Could you please share your first name and last name? For example: John Smith`,
        `Thank you! To make sure I record your name properly, could you please provide your first name and last name? Example: John Smith`,
        `I appreciate your patience. May I please have your first name and last name? For example: John Smith`,
        `To ensure I get this right, could you please share your first name and last name with me? Example: John Smith`,
        `I want to make sure I have your name correctly. May I please have your first name and last name? For example: John Smith`,
        `Thank you! To confirm, could you please provide your first name and last name? Example: John Smith`,
        `I'd like to ensure accuracy. May I please have your first name and last name? For example: John Smith`,
        `To make certain I record your name properly, could you please share your first name and last name? Example: John Smith`
      ];

      response = getRandomResponse(nameClarificationResponses);
      nextState = 'waiting_for_name';
      highlightedText = ['first name', 'last name'];
      quickActions = [];
    }
    break;

  case 'waiting_for_dob':
    if (validateDateOfBirth(message)) {
      collectedData.dateOfBirth = formatDateOfBirth(message);
      collectedData.dob = formatDateOfBirth(message);

      const phoneResponses = [
        `Perfect. May I please have your phone number?`,
        `Thank you. Could you please share your phone number?`,
        `Great. May I please have your phone number?`,
        `Perfect. Could you please provide your phone number?`
      ];

      response = getRandomResponse(phoneResponses);
      nextState = 'waiting_for_phone';
      highlightedText = ['phone number'];
      quickActions = [];
    } else {
      const dobClarificationResponses = [
        `I need a valid date of birth to continue. Could you please provide it in MM/DD/YYYY format? For example: 03/15/1985`,
        `To ensure accuracy, may I please have your date of birth in MM/DD/YYYY format? Example: 03/15/1985`,
        `I'd like to make certain I have the correct date. Could you please share your date of birth as MM/DD/YYYY? Example: 03/15/1985`,
        `Thank you for your patience. May I please have your date of birth in MM/DD/YYYY format? For example: 03/15/1985`,
        `To make sure I record this correctly, could you please provide your date of birth as MM/DD/YYYY? Example: 03/15/1985`,
        `I want to ensure accuracy. May I please have your date of birth in MM/DD/YYYY format? For example: 03/15/1985`,
        `Thank you! To continue, could you please share your date of birth as MM/DD/YYYY? Example: 03/15/1985`,
        `I appreciate your understanding. May I please have your date of birth in MM/DD/YYYY format? For example: 03/15/1985`,
        `To make certain I get this right, could you please provide your date of birth as MM/DD/YYYY? Example: 03/15/1985`,
        `Thank you for your patience. May I please have your date of birth in MM/DD/YYYY format? For example: 03/15/1985`
      ];

      response = getRandomResponse(dobClarificationResponses);
      nextState = 'waiting_for_dob';
      highlightedText = ['MM/DD/YYYY'];
      quickActions = [];
    }
    break;

  default:
    response = `I'm here to help you schedule an appointment. Would you like to get started?`;
    nextState = 'initial';
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
    module: 'patient-info-collector'
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
};