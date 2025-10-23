CURRENT CODE:

const nodeStartTime = Date.now();
console.log(`⏱️ [INTENT DETECTOR] Started at ${nodeStartTime}`);

const input = $input.first().json;
const message = (input.message || '').toLowerCase();
const currentState = input.currentState || input.bookingState || 'initial';
const collectedData = input.collectedData || {};
const bookingData = input.bookingData || {};
const pausedBookingState = input.pausedBookingState || null;
const pausedBookingData = input.pausedBookingData || null;

console.log('🔍 Message:', message?.substring(0, 30), '| State:', currentState);

// Question keywords
const questionKeywords = [
  'what', 'which', 'who', 'where', 'when', 'how', 'why',
  'tell me', 'explain', 'describe', 'do you offer', 'do you have',
  'services', 'procedures', 'treatment', 'location', 'team', 'hours',
  'accept', 'insurance', 'cost', 'price', 'fee', 'can you', 'will'
];

const isQuestion = questionKeywords.some(keyword => {
  if (keyword.includes(' ')) {
    return message.includes(keyword);
  } else {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(message);
  }
});

// Handle Resume Booking request
if (message === 'resume_booking' || message === 'resume booking') {
  console.log('🔄 RESUME BOOKING - Restoring state:', pausedBookingState);
  const nodeEndTime = Date.now();
  console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);
  return [{
    json: {
      ...input,
      intent: 'booking',
      route: 'booking',
      bookingState: pausedBookingState || 'initial',  // 🚨 RESTORE THE SAVED STATE
      currentState: pausedBookingState || 'initial',   // 🚨 RESTORE THE SAVED STATE
      bookingData: pausedBookingData || {},            // 🚨 RESTORE THE SAVED DATA
      collectedData: pausedBookingData || {},          // 🚨 RESTORE THE SAVED DATA
      pausedBookingState: null,  // Clear paused state after resuming
      pausedBookingData: null    // Clear paused data after resuming
    }
  }];
}

// Handle questions during booking flow
if (currentState !== 'initial' && currentState !== 'complete' && currentState !== 'paused') {
  const inputStates = [
    'waiting_for_name', 'waiting_for_dob', 'waiting_for_phone', 'waiting_for_email',
    'waiting_for_location', 'waiting_for_pain_level', 'waiting_for_symptoms',
    'waiting_for_procedure', 'waiting_for_insurance', 'waiting_for_time_preference',
    'waiting_for_urgency', 'waiting_for_day_selection', 'generating_appointment_slots'
  ];

  const isInputState = inputStates.includes(currentState);

  if (isInputState) {
    const startsWithQuestion = /^(what|which|who|where|when|how|why|can you|do you|will you|could you|tell me|explain|describe)/i.test(message);

    if (startsWithQuestion) {
      console.log('🔄 CLEAR QUESTION - Pausing booking');
      const nodeEndTime = Date.now();
      console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);
      return [{
        json: {
          ...input,
          intent: 'question',
          route: 'healthcare_concierge',
          pausedBookingState: currentState,
          pausedBookingData: { ...collectedData, ...bookingData }
        }
      }];
    } else {
      console.log('✅ INPUT STATE - Continue booking');
      const nodeEndTime = Date.now();
      console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);
      return [{
        json: {
          ...input,
          intent: 'booking',
          route: 'booking'
        }
      }];
    }
  } else if (isQuestion) {
    console.log('🔄 QUESTION - Pausing booking');
    const nodeEndTime = Date.now();
    console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);
    return [{
      json: {
        ...input,
        intent: 'question',
        route: 'healthcare_concierge',
        pausedBookingState: currentState,
        pausedBookingData: { ...collectedData, ...bookingData }
      }
    }];
  } else {
    console.log('✅ ALREADY IN BOOKING');
    const nodeEndTime = Date.now();
    console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);
    return [{
      json: {
        ...input,
        intent: 'booking',
        route: 'booking'
      }
    }];
  }
}

// Detect booking intent
const bookingKeywords = [
  'appointment', 'book', 'schedule', 'make an appointment', 'set up', 'arrange',
  'like to schedule', 'like to book', 'want to schedule', 'want to book',
  'want an appointment', 'need to schedule', 'need to book', 'need an appointment'
];
const isBooking = bookingKeywords.some(keyword => message.includes(keyword));

let intent = 'question';
let route = 'healthcare_concierge';

if (isBooking && !isQuestion) {
  intent = 'booking';
  route = 'booking';
}

console.log('🔍 Intent:', intent, '| Route:', route);

const output = {
  ...input,
  intent: intent,
  route: route
};

if (pausedBookingState && route === 'healthcare_concierge') {
  output.pausedBookingState = pausedBookingState;
  output.pausedBookingData = pausedBookingData;
}

const nodeEndTime = Date.now();
console.log(`⏱️ [INTENT DETECTOR] Completed in ${nodeEndTime - nodeStartTime}ms`);

return [{
  json: output,
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
}];