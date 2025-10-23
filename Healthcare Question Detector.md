CURRENT CODE:

const items = $input.all();
const input = items[0].json;

// Get data from BOTH the LLM response AND the previous nodes
const llmInput = $input.first().json;
const promptBuilderData = $('Healthcare Concierge Prompt Builder').first().json;
const userMessage = promptBuilderData.userMessage || '';
const demoContext = promptBuilderData.demoContext || {};
const teamMembers = demoContext.teamMembers || [];

// CRITICAL FIX: Get pausedBookingState from Prompt Builder's OUTPUT
// (Prompt Builder should have passed it through in its return statement)
const pausedBookingState = promptBuilderData.pausedBookingState || llmInput.pausedBookingState || null;
const pausedBookingData = promptBuilderData.pausedBookingData || llmInput.pausedBookingData || null;

console.log('🔍 Paused Booking State:', pausedBookingState);
console.log('🔍 Paused Booking Data:', pausedBookingData ? Object.keys(pausedBookingData) : 'none');

console.log('🔍 Healthcare Question Detector Input:', JSON.stringify(input, null, 2));
console.log('💬 LLM Response:', input.message);

// Medical keywords that require escalation
const medicalKeywords = [
  'diagnose', 'diagnosis', 'treatment', 'medication', 'prescription',
  'surgery', 'procedure recommend', 'cure', 'heal', 'prognosis',
  'side effects', 'recovery time', 'medical advice', 'should i take',
  'is it safe', 'is this normal', 'what should i do', 'doctor recommend'
];

const isMedical = medicalKeywords.some(keyword =>
  userMessage.toLowerCase().includes(keyword)
);

let finalResponse = input.message;
let highlightedText = [];
let quickActions = [];

if (isMedical && teamMembers.length > 0) {
  const medicalStaff = teamMembers.find(member =>
    member.role && (
      member.role.toLowerCase().includes('nurse') ||
      member.role.toLowerCase().includes('medical') ||
      member.role.toLowerCase().includes('physician') ||
      member.role.toLowerCase().includes('doctor')
    )
  ) || teamMembers[0];

  const firstName = medicalStaff.first_name || medicalStaff.firstName || '';
  const lastName = medicalStaff.last_name || medicalStaff.lastName || '';
  const role = medicalStaff.role || 'medical professional';

  finalResponse = input.message + `\
\
For medical questions like this, I'd like to connect you with ${firstName} ${lastName}, our ${role}. Would you like ${firstName} to call you back?`;

  highlightedText = [firstName, lastName];

  // Include Resume Booking if booking was paused
  if (pausedBookingState) {
    quickActions = [
      { label: 'Resume Booking', value: 'resume_booking' },
      { label: 'Yes, please call me back', value: 'callback' },
      { label: 'No, I\'ll call the office', value: 'no_callback' }
    ];
  } else {
    quickActions = [
      { label: 'Yes, please call me back', value: 'callback' },
      { label: "No, I'll call the office", value: 'no_callback' },
      { label: 'Schedule an Appointment', value: "I'd like to schedule an appointment." }
    ];
  }

  console.log('🏥 Medical question detected - escalation offered');
} else {
  // Include Resume Booking if booking was paused
  if (pausedBookingState) {
    quickActions = [
      { label: 'Resume Booking', value: 'resume_booking' },
      { label: 'Ask Another Question', value: 'continue' }
    ];
    console.log('💬 General question answered - Resume Booking available');
  } else {
    quickActions = [
      { label: 'Schedule an Appointment', value: "I'd like to schedule an appointment." },
      { label: 'Ask Another Question', value: 'continue' }
    ];
    console.log('💬 General question answered');
  }
}

// 🚨 CRITICAL FIX: Store timestamp as ISO string in variable
const currentTimestamp = new Date().toISOString();

// 🚨 CRITICAL FIX: DO NOT return bookingState - it overwrites the active booking!
// Only return pausedBookingState to preserve context for multiple Q&A rounds
return items.map((item, index) => ({
  json: {
    message: finalResponse,
    currentState: pausedBookingState ? 'paused' : 'complete',
    highlightedText: highlightedText,
    quickActions: quickActions,
    demoContext: demoContext,
    // ❌ DO NOT RETURN bookingState - it overwrites the active booking progress!
    // ❌ DO NOT RETURN bookingData - preserve original booking data only in paused state
    pausedBookingState: pausedBookingState,    // ✅ Pass through paused state
    pausedBookingData: pausedBookingData,      // ✅ Pass through paused data
    timestamp: currentTimestamp
  },
  pairedItem: index
}));