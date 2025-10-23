CURRENT CODE:

/**
 * APPOINTMENT SCHEDULER MODULE - FIXED VERSION
 * Handles: Insurance, scheduling preferences, slot selection, additional info, confirmation
 *
 * CRITICAL FIXES APPLIED:
 * ✅ Removed day selection step (goes straight from time preference → API call)
 * ✅ Fixed duplicate slot display (buttons only, no numbered list in text)
 * ✅ Added routedTo field to ALL returns (prevents state reset bug)
 * ✅ Fixed state naming (generating_appointment_slots to match state manager)
 */

// Get input data
let inputData;
try {
  inputData = $input.all();
} catch (e) {
  inputData = [{
    json: {
      message: '',
      bookingState: 'waiting_for_insurance',
      bookingData: {},
      demoContext: {}
    }
  }];
}

const item = inputData[0].json;
const message = item.message || '';
const bookingState = item.bookingState || item.currentState || 'waiting_for_insurance';
const bookingData = item.bookingData || item.collectedData || {};
const demoContext = item.demoContext || {};

let response = '';
let nextState = bookingState;
let collectedData = { ...bookingData };
let highlightedText = [];
let quickActions = [];

console.log('📅 APPOINTMENT SCHEDULER:', {
  bookingState,
  message,
  hasAvailableSlots: !!(bookingData.availableSlots || item.collectedData?.availableSlots),
  slotsCount: (bookingData.availableSlots || item.collectedData?.availableSlots || []).length
});

// Utility functions
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function validatePolicyHolderName(input) {
  const nameMatch = input.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
  return nameMatch !== null;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseIfString(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.log('Failed to parse JSON:', e);
      return {};
    }
  }
  return data;
}

// STATE HANDLERS
switch (bookingState) {

  case 'waiting_for_insurance':
    if (message.toLowerCase() === 'none' || message.toLowerCase() === 'no insurance' || message.toLowerCase() === 'no') {
      collectedData.insurance = 'Self-Pay';
      collectedData.policyHolderName = 'N/A';
      collectedData.policyNumber = 'N/A';
      collectedData.groupNumber = 'N/A';

      const urgencyResponses = [
        `That's perfectly fine. Thank you for letting me know. Now, how soon would you like to be seen for your appointment?`,
        `No problem at all. I appreciate you sharing that with me. When would you like to schedule your visit?`,
        `Thank you for that information. May I ask how soon you'd like to come in for your appointment?`,
        `That's okay. I have that noted. When would be the best time for you to be seen?`,
        `No worries. Thank you. How quickly would you like to schedule your appointment?`,
        `That's fine. I appreciate you letting me know. When would you prefer to come in?`,
        `Thank you for sharing that. May I ask when you'd like to be seen?`,
        `That's perfectly alright. When would work best for your appointment?`,
        `No problem. I have that recorded. How soon would you like to schedule your visit?`,
        `Thank you. I appreciate that information. When would you like to come in for your appointment?`
      ];

      response = getRandomResponse(urgencyResponses);
      nextState = 'waiting_for_urgency';
      highlightedText = ['how soon'];
      quickActions = [
        { text: 'As soon as possible', action: 'next_available' },
        { text: 'Within the next week', action: 'next_week' },
        { text: 'Within 2 weeks', action: '2_weeks' },
        { text: 'Next month', action: 'next_month' }
      ];
    } else {
      collectedData.insurance = message;

      const policyHolderResponses = [
        `Perfect. I have ${message} as your insurance provider. May I please have the policy holder's first name and last name?`,
        `Thank you. May I please have the policy holder's first name and last name?`,
        `Great. I have ${message} recorded. Could you please provide the policy holder's first name and last name?`,
        `Perfect. May I please have the policy holder's first name and last name?`
      ];

      response = getRandomResponse(policyHolderResponses);
      nextState = 'waiting_for_policy_holder_name';
      highlightedText = ['policy holder', 'first name', 'last name'];
      quickActions = [];
    }
    break;

  case 'waiting_for_policy_holder_name':
    if (validatePolicyHolderName(message)) {
      const nameMatch = message.match(/^([A-Za-z]+)[\s]+([A-Za-z]+)$/);
      collectedData.policyHolderName = `${capitalizeFirstLetter(nameMatch[1])} ${capitalizeFirstLetter(nameMatch[2])}`;

      const policyNumberResponses = [
        `Perfect. I have the policy holder as ${collectedData.policyHolderName}. May I please have the insurance policy number?`,
        `Thank you. May I please have your policy number?`,
        `Great. I have ${collectedData.policyHolderName} noted. Could you please provide the policy number?`,
        `Perfect. May I please have the insurance policy number?`
      ];

      response = getRandomResponse(policyNumberResponses);
      nextState = 'waiting_for_policy_number';
      highlightedText = ['policy number'];
      quickActions = [];
    } else {
      const nameValidationResponses = [
        `I want to make sure I have the policy holder's name correct. Could you please provide the first name and last name? For example: John Smith`,
        `To ensure accuracy, may I please have the policy holder's first name and last name? Example: John Smith`,
        `I'd like to make certain I get this right. Could you please share the policy holder's first name and last name? For example: John Smith`,
        `Thank you for your patience. May I please have the policy holder's first name and last name? Example: John Smith`,
        `To make sure I record this correctly, could you please provide the policy holder's first name and last name? For example: John Smith`,
        `I want to ensure accuracy. May I please have the policy holder's first name and last name? Example: John Smith`,
        `Thank you! To continue, could you please share the policy holder's first name and last name? For example: John Smith`,
        `I appreciate your understanding. May I please have the policy holder's full name? Example: John Smith`,
        `To make certain I get this right, could you please provide the policy holder's first name and last name? For example: John Smith`,
        `Thank you for your patience. May I please have the policy holder's first name and last name? Example: John Smith`
      ];

      response = getRandomResponse(nameValidationResponses);
      nextState = 'waiting_for_policy_holder_name';
      highlightedText = ['first name', 'last name'];
      quickActions = [];
    }
    break;

  case 'waiting_for_policy_number':
    collectedData.policyNumber = message;

    const groupNumberResponses = [
      `Perfect! I have your policy number. Thank you for that. May I please have your group number? If you don't have one, you can type "none" or select N/A.`,
      `Excellent! Your policy number is recorded. Could you please share your group number? Type "none" if not applicable.`,
      `Thank you! I've got your policy number. May I please have the group number? You can type "none" if you don't have one.`,
      `Great! I have your policy number noted. Could you please provide your group number? Type "none" if not applicable.`,
      `Wonderful! Your policy number is recorded. May I please have the group number? Select N/A if you don't have one.`,
      `Perfect! I've got your policy number. Thank you. Could you please share your group number? Type "none" if not applicable.`,
      `Excellent! I have your policy number. May I please have your group number? You can type "none" if you don't have one.`,
      `Thank you! Your policy number is noted. Could you please provide your group number? Type "none" if not applicable.`,
      `Great! I've recorded your policy number. May I please have the group number? Select N/A if you don't have one.`,
      `Wonderful! Your policy number is recorded. Thank you. Could you please share your group number? Type "none" if not applicable.`
    ];

    response = getRandomResponse(groupNumberResponses);
    nextState = 'waiting_for_group_number';
    highlightedText = ['group number'];
    quickActions = [{ text: "I don't have a Group number", action: 'none' }];
    break;

  case 'waiting_for_group_number':
    collectedData.groupNumber = message.toLowerCase() === 'none' ? 'N/A' : message;

    const urgencyResponses = [
      `Perfect! I have all your insurance information. Thank you so much. Now, how soon would you like to be seen for your appointment?`,
      `Excellent! Your insurance details are recorded. Thank you. When would you like to schedule your visit?`,
      `Thank you! I've got all the insurance information. May I ask how soon you'd like to come in?`,
      `Great! I have your insurance details noted. When would be the best time for you to be seen?`,
      `Wonderful! All your insurance information is recorded. How quickly would you like to schedule your appointment?`,
      `Perfect! I've got all the insurance details. Thank you. When would you prefer to come in?`,
      `Excellent! I have your insurance information complete. May I ask when you'd like to be seen?`,
      `Thank you! Your insurance details are all recorded. When would work best for your appointment?`,
      `Great! I've got all your insurance information. How soon would you like to schedule your visit?`,
      `Wonderful! All insurance details are recorded. Thank you. When would you like to come in for your appointment?`
    ];

    response = getRandomResponse(urgencyResponses);
    nextState = 'waiting_for_urgency';
    highlightedText = ['how soon'];
    quickActions = [
      { text: 'As soon as possible', action: 'next_available' },
      { text: 'Within the next week', action: 'next_week' },
      { text: 'Within 2 weeks', action: '2_weeks' },
      { text: 'Next month', action: 'next_month' }
    ];
    break;

  case 'waiting_for_urgency':
    collectedData.urgency = message;

    const timePreferenceResponses = [
      `Perfect! I understand your timeframe. Thank you. What time of day works best for you?`,
      `Excellent! I have your preferred timeframe. When during the day would you prefer to come in?`,
      `Thank you! I've noted your scheduling preference. What time of day would be most convenient?`,
      `Great! I have your timeframe recorded. When during the day would work best for you?`,
      `Wonderful! Your scheduling preference is noted. What time of day would you prefer?`,
      `Perfect! I've got your timeframe. Thank you. When during the day would be most convenient for you?`,
      `Excellent! I have your scheduling preference. What time of day works best?`,
      `Thank you! Your timeframe is recorded. When during the day would you prefer to come in?`,
      `Great! I've noted your preference. What time of day would be most convenient?`,
      `Wonderful! Your timeframe is recorded. Thank you. When during the day would work best for you?`
    ];

    response = getRandomResponse(timePreferenceResponses);
    nextState = 'waiting_for_time_preference';
    highlightedText = ['time of day'];
    quickActions = [
      { text: 'Morning (6 AM - 12 PM)', action: 'morning' },
      { text: 'Afternoon (12 PM - 5 PM)', action: 'afternoon' },
      { text: 'Evening (5 PM - 9 PM)', action: 'evening' },
      { text: 'Any time', action: 'any' }
    ];
    break;

  case 'waiting_for_time_preference':
    collectedData.timePreference = message;

    // 🚨 FIX #1: Skip day selection - go straight to API call
    console.log('🏥 Setting up Epic API call with urgency + time preference...');

    // 🚨 CRITICAL FIX: Don't return a message here - let EHR Integration Manager handle the response!
    response = '';
    nextState = 'calling_epic_api';
    highlightedText = [];
    quickActions = [];

    // Set flag to trigger Epic API call
    // ✅ FIX: Use STRING instead of boolean to prevent IF node type error
    collectedData.callEpicAPI = "true";
    collectedData.callEHRIntegration = "true"; // STRING for EHR Integration Manager
    collectedData.epicAPIParams = {
      urgency: collectedData.urgency,
      timeOfDay: collectedData.timePreference,
      serviceType: collectedData.procedure || collectedData.service || 'General Consultation',
      providerId: collectedData.specialist || 'Dr. Hassan',
      demoId: demoContext.demoId || item.demoId,
      patientType: collectedData.patientType || 'new'
    };
    collectedData.ehrIntegrationParams = collectedData.epicAPIParams; // Alias for EHR Integration Manager
    break;

  case 'calling_epic_api':
    // This state is handled by EHR Integration Manager node
    // When Epic API returns slots, we display them here

    // 🚨 FIX: Check both collectedData and bookingData for slots
    // ALSO check item.availableSlots (direct from EHR Integration Manager)
    const realSlots = item.availableSlots || collectedData.availableSlots || bookingData.availableSlots || [];

    console.log('🔍 DEBUG: checking for slots...', {
      currentState: bookingState,
      routedFrom: item.routedFrom,
      itemSlots: item.availableSlots?.length || 0,
      collectedDataSlots: collectedData.availableSlots?.length || 0,
      bookingDataSlots: bookingData.availableSlots?.length || 0,
      totalSlots: realSlots.length
    });

    // If no slots yet (still calling API), wait for EHR Integration Manager to return
    if (realSlots.length === 0) {
      console.log('⏳ Waiting for EHR Integration Manager to return slots...');
      // Don't send a message yet, let EHR Integration Manager handle this
      response = '';
      nextState = 'calling_epic_api';
      highlightedText = [];
      quickActions = [];
      break;
    }

    console.log('✅ Received REAL slots from Epic API:', realSlots.length);
    console.log('📋 First slot structure:', realSlots[0]);

    // 🚨 FIX #2: Remove numbered list from response - buttons only!
    const slotDisplayResponses = [
      `Perfect! Here are your available appointments:`,
      `Wonderful! I found these available times for you:`,
      `Great! Here are your options:`,
      `Excellent! I have these appointments available:`,
      `Thank you! Here are the times I found:`
    ];

    response = getRandomResponse(slotDisplayResponses);
    nextState = 'generating_appointment_slots'; // Move to slot selection state
    highlightedText = ['available'];

    // 🚨 CRITICAL FIX: Safely access slot properties with fallbacks
    quickActions = realSlots.map((slot, i) => {
      // Handle different slot formats
      const day = slot.day || slot.dayOfWeek || 'TBD';
      const date = slot.date || slot.displayDate || '';
      const time = slot.time || slot.displayTime || '';

      console.log(`📅 Slot ${i}:`, { day, date, time });

      return {
        text: `${day}, ${date} at ${time}`,
        action: `slot_${i}`
      };
    });

    // 🚨 CRITICAL: Store slots in collectedData for next state
    collectedData.availableSlots = realSlots;

    // 🚨 CRITICAL FIX: Clear the EHR call flags now that we have the slots!
    collectedData.callEHRIntegration = undefined;
    collectedData.callEpicAPI = undefined;

    console.log('🎯 CLEARED FLAGS! callEHRIntegration:', collectedData.callEHRIntegration);
    console.log('🎯 Available slots:', collectedData.availableSlots?.length);
    break;

  case 'generating_appointment_slots':
    const slotIndex = parseInt(message.replace('slot_', ''));

    // 🚨 CRITICAL FIX: Check if availableSlots exists and has the requested slot
    console.log('🔍 DEBUG generating_appointment_slots:', {
      slotIndex,
      availableSlotsLength: collectedData.availableSlots?.length || 0,
      bookingDataSlotsLength: bookingData.availableSlots?.length || 0
    });

    const slots = collectedData.availableSlots || bookingData.availableSlots || [];
    const selectedSlot = slots[slotIndex];

    // 🚨 CRITICAL: If slot doesn't exist, return error
    if (!selectedSlot) {
      console.log('❌ ERROR: No slot found at index', slotIndex);
      response = 'I apologize, but there was an issue selecting that appointment time. Please call us directly to schedule.';
      nextState = 'error_slot_selection';
      highlightedText = [];
      quickActions = [];
      break;
    }

    collectedData.appointmentSlot = selectedSlot;

    // Safe property access with fallbacks
    const slotDay = selectedSlot.day || selectedSlot.dayOfWeek || 'TBD';
    const slotDate = selectedSlot.date || selectedSlot.displayDate || '';
    const slotTime = selectedSlot.time || selectedSlot.displayTime || '';

    console.log('✅ Slot selected:', { slotDay, slotDate, slotTime });

    const additionalInfoResponses = [
      `Excellent. I have ${slotDay}, ${slotDate} at ${slotTime} reserved for you. Before we confirm, is there any additional information you'd like to share?`,
      `Perfect. I have ${slotDay}, ${slotDate} at ${slotTime} reserved. Is there anything else you'd like us to know before your visit?`,
      `Great. I have ${slotDay}, ${slotDate} at ${slotTime} reserved. Is there any additional information you'd like to provide?`,
      `Perfect. I have ${slotDay}, ${slotDate} at ${slotTime} reserved for you. Is there anything else we should know?`
    ];

    response = getRandomResponse(additionalInfoResponses);
    nextState = 'waiting_for_additional_info';
    highlightedText = ['additional information'];
    quickActions = [
      { text: 'Yes, I have additional info', action: 'provide_info' },
      { text: 'No, I\'m all set', action: 'skip' }
    ];
    break;

  case 'waiting_for_additional_info':
    if (message.toLowerCase() === 'skip' || message.toLowerCase().includes('all set')) {
      collectedData.additionalNotes = null;
      nextState = 'showing_summary';
    } else if (message.toLowerCase() === 'provide_info') {
      const collectInfoResponses = [
        `Of course! I'd be happy to note any additional information. Please go ahead and share whatever you'd like us to know.`,
        `Absolutely! I'm here to help. Please share any additional details, questions, or concerns you have.`,
        `Certainly! I'd love to hear what additional information you'd like to provide. Please go ahead.`,
        `Of course! Please feel free to share any additional information that would help us serve you better.`,
        `Absolutely! I'm listening. Please share any details, concerns, or questions you have.`
      ];

      response = getRandomResponse(collectInfoResponses);
      nextState = 'collecting_additional_info';
      highlightedText = [];
      quickActions = [];
      break;
    } else {
      collectedData.additionalNotes = message;
      nextState = 'showing_summary';
    }

    // Show summary
    if (nextState === 'showing_summary') {
      const insuranceSec = collectedData.insurance && collectedData.insurance !== 'Self-Pay' ? `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Insurance:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Provider:</strong> ${collectedData.insurance}</li>
      ${collectedData.policyHolderName ? `<li><strong>Policy Holder:</strong> ${collectedData.policyHolderName}</li>` : ''}
      ${collectedData.policyNumber ? `<li><strong>Policy #:</strong> ${collectedData.policyNumber}</li>` : ''}
      ${collectedData.groupNumber ? `<li><strong>Group #:</strong> ${collectedData.groupNumber}</li>` : ''}
    </ul>
  </div>` : `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Payment:</strong>
    <p style="margin: 8px 0; color: #e2e8f0;">Self-Pay</p>
  </div>`;

      const additionalSec = collectedData.additionalNotes ? `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Additional Information:</strong>
    <p style="margin: 8px 0; color: #e2e8f0; font-size: 13px;">${collectedData.additionalNotes}</p>
  </div>` : '';

      response = `
<div style="line-height: 1.6;">
  <p style="margin-bottom: 16px;"><strong>Thank you! Please review your appointment details:</strong></p>

  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Patient Information:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Name:</strong> ${collectedData.firstName} ${collectedData.lastName}</li>
      <li><strong>Date of Birth:</strong> ${collectedData.dateOfBirth || collectedData.dob}</li>
      <li><strong>Phone:</strong> ${collectedData.phoneNumber || collectedData.phone}</li>
      <li><strong>Email:</strong> ${collectedData.email}</li>
    </ul>
  </div>

  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Appointment Details:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Date & Time:</strong> ${collectedData.appointmentSlot.dayOfWeek || collectedData.appointmentSlot.day}, ${(() => {
        const dateStr = collectedData.appointmentSlot.date;
        if (!dateStr) return 'Date TBD';
        // Convert YYYY-MM-DD to MM/DD/YYYY
        if (dateStr.includes('-')) {
          const [year, month, day] = dateStr.split('-');
          return \`\${month}/\${day}/\${year}\`;
        }
        return dateStr;
      })()} at ${collectedData.appointmentSlot.time}</li>
      <li><strong>Location:</strong> ${collectedData.location}</li>
      <li><strong>Service:</strong> ${collectedData.procedure || collectedData.service}</li>
      <li><strong>Pain Level:</strong> ${collectedData.painLevel}/10</li>
      <li><strong>Symptoms:</strong> ${collectedData.symptoms}</li>
    </ul>
  </div>

  ${insuranceSec}
  ${additionalSec}

  <div style="background: rgba(34, 197, 94, 0.08); border-left: 3px solid #22c55e; padding: 12px; margin: 16px 0; border-radius: 4px;">
    <strong style="color: #4ade80; font-size: 13px;">📱 Consent:</strong>
    <p style="margin: 8px 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
      By confirming, you consent to be contacted via phone, SMS, and email for appointment confirmation, reminders, and follow-up care.
    </p>
  </div>

  <p style="margin-top: 16px;">Is all the information correct?</p>
</div>`.trim();

      nextState = 'waiting_for_review_confirmation';
      highlightedText = [];
      quickActions = [
        { text: 'Confirm & Book', action: 'confirm' },
        { text: 'Change something', action: 'change' }
      ];
    }
    break;

  case 'collecting_additional_info':
    collectedData.additionalNotes = message;
    nextState = 'showing_summary';

    const insuranceSec2 = collectedData.insurance && collectedData.insurance !== 'Self-Pay' ? `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Insurance:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Provider:</strong> ${collectedData.insurance}</li>
      ${collectedData.policyHolderName ? `<li><strong>Policy Holder:</strong> ${collectedData.policyHolderName}</li>` : ''}
      ${collectedData.policyNumber ? `<li><strong>Policy #:</strong> ${collectedData.policyNumber}</li>` : ''}
      ${collectedData.groupNumber ? `<li><strong>Group #:</strong> ${collectedData.groupNumber}</li>` : ''}
    </ul>
  </div>` : `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Payment:</strong>
    <p style="margin: 8px 0; color: #e2e8f0;">Self-Pay</p>
  </div>`;

    const additionalSec2 = collectedData.additionalNotes ? `
  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Additional Information:</strong>
    <p style="margin: 8px 0; color: #e2e8f0; font-size: 13px;">${collectedData.additionalNotes}</p>
  </div>` : '';

    response = `
<div style="line-height: 1.6;">
  <p style="margin-bottom: 16px;"><strong>Thank you! Please review your appointment details:</strong></p>

  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Patient Information:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Name:</strong> ${collectedData.firstName} ${collectedData.lastName}</li>
      <li><strong>Date of Birth:</strong> ${collectedData.dateOfBirth || collectedData.dob}</li>
      <li><strong>Phone:</strong> ${collectedData.phoneNumber || collectedData.phone}</li>
      <li><strong>Email:</strong> ${collectedData.email}</li>
    </ul>
  </div>

  <div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 12px 0; border-radius: 4px;">
    <strong style="color: #fb923c; font-size: 14px;">Appointment Details:</strong>
    <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
      <li><strong>Date & Time:</strong> ${collectedData.appointmentSlot.dayOfWeek || collectedData.appointmentSlot.day}, ${(() => {
        const dateStr = collectedData.appointmentSlot.date;
        if (!dateStr) return 'Date TBD';
        // Convert YYYY-MM-DD to MM/DD/YYYY
        if (dateStr.includes('-')) {
          const [year, month, day] = dateStr.split('-');
          return \`\${month}/\${day}/\${year}\`;
        }
        return dateStr;
      })()} at ${collectedData.appointmentSlot.time}</li>
      <li><strong>Location:</strong> ${collectedData.location}</li>
      <li><strong>Service:</strong> ${collectedData.procedure || collectedData.service}</li>
      <li><strong>Pain Level:</strong> ${collectedData.painLevel}/10</li>
      <li><strong>Symptoms:</strong> ${collectedData.symptoms}</li>
    </ul>
  </div>

  ${insuranceSec2}
  ${additionalSec2}

  <div style="background: rgba(34, 197, 94, 0.08); border-left: 3px solid #22c55e; padding: 12px; margin: 16px 0; border-radius: 4px;">
    <strong style="color: #4ade80; font-size: 13px;">📱 Consent:</strong>
    <p style="margin: 8px 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
      By confirming, you consent to be contacted via phone, SMS, and email for appointment confirmation, reminders, and follow-up care.
    </p>
  </div>

  <p style="margin-top: 16px;">Is all the information correct?</p>
</div>`.trim();

    nextState = 'waiting_for_review_confirmation';
    highlightedText = [];
    quickActions = [
      { text: 'Confirm & Book', action: 'confirm' },
      { text: 'Change something', action: 'change' }
    ];
    break;

  case 'waiting_for_review_confirmation':
    if (message.toLowerCase().includes('confirm')) {
      const confirmationResponses = [
        `Perfect! Your appointment is confirmed!\n\n✅ Date: ${collectedData.appointmentSlot.day}, ${collectedData.appointmentSlot.date}\n⏰ Time: ${collectedData.appointmentSlot.time}\n📍 Location: ${collectedData.location}\n\n📧 A confirmation email has been sent to ${collectedData.email}\n📱 You'll receive SMS reminders before your appointment\n\nWe look forward to seeing you! If you need to make any changes, please call us.`,
        `Wonderful! Your appointment is all set!\n\n✅ ${collectedData.appointmentSlot.day}, ${collectedData.appointmentSlot.date} at ${collectedData.appointmentSlot.time}\n📍 ${collectedData.location}\n\n📧 Confirmation sent to ${collectedData.email}\n\nThank you for choosing us for your care. We're here to help you feel better!`,
        `Excellent! Your appointment has been confirmed!\n\nDate: ${collectedData.appointmentSlot.day}, ${collectedData.appointmentSlot.date}\nTime: ${collectedData.appointmentSlot.time}\nLocation: ${collectedData.location}\n\nConfirmation email sent to ${collectedData.email}\n\nWe're looking forward to seeing you and helping you with your care!`
      ];

      response = getRandomResponse(confirmationResponses);
      nextState = 'appointment_confirmed';
      highlightedText = [];
      quickActions = [];
    } else {
      const changeResponses = [
        `Of course! I'd be happy to help you make changes. What would you like to update?`,
        `No problem at all. What information would you like to change?`,
        `Absolutely! I'm here to help. What would you like to modify?`,
        `Certainly! What would you like to update in your appointment?`,
        `Of course! I'm happy to make changes. What would you like to adjust?`
      ];

      response = getRandomResponse(changeResponses);
      nextState = 'handling_changes';
      highlightedText = [];
      quickActions = [];
    }
    break;

  default:
    response = `Let me help you schedule your appointment. Do you have insurance coverage?`;
    nextState = 'waiting_for_insurance';
    break;
}

// 🚨 FIX #4: Add routedTo field to ALL returns!
// ✅ CRITICAL FIX: Route to merge in these cases:
// 1. When callEHRIntegration flag is set (need to call EHR API)
// 2. When message came FROM ehr-integration-manager (need to display slots to user)
// 3. When we have a response to show (not empty string)
// 🚨 CRITICAL FIX: When flags are set, DON'T route to merge - let Check EHR Call IF node handle it!
const shouldRouteToMerge =
    (item.routedFrom === 'ehr-integration-manager' && response !== '') ||
    (nextState !== 'calling_epic_api' && nextState !== 'waiting_for_time_preference' && response !== '');

console.log('🔍 FINAL CHECK:', {
  callEHRIntegration: collectedData.callEHRIntegration,
  callEpicAPI: collectedData.callEpicAPI,
  routedFrom: item.routedFrom,
  hasResponse: response !== '',
  nextState: nextState,
  shouldRouteToMerge: shouldRouteToMerge,
  hasSlots: !!collectedData.availableSlots,
  slotsCount: collectedData.availableSlots?.length || 0
});

// 🚨 CRITICAL DEBUG: Log the EXACT data being returned for Check EHR Call IF node
const returnData = {
  json: {
    message: response,
    currentState: nextState,
    bookingState: nextState,
    collectedData: collectedData,
    bookingData: collectedData,
    highlightedText: highlightedText,
    quickActions: quickActions,
    demoContext: demoContext,
    routedTo: shouldRouteToMerge ? 'merge' : 'appointment-scheduler', // ✅ Route to merge when needed!
    timestamp: new Date().toISOString(),
    module: 'appointment-scheduler'
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
};

console.log('🚨🚨🚨 APPOINTMENT SCHEDULER RETURN DATA:');
console.log('  - collectedData.callEHRIntegration:', returnData.json.collectedData.callEHRIntegration);
console.log('  - collectedData.callEpicAPI:', returnData.json.collectedData.callEpicAPI);
console.log('  - currentState:', returnData.json.currentState);
console.log('  - message length:', returnData.json.message.length);
console.log('  - quickActions count:', returnData.json.quickActions.length);
console.log('  - routedTo:', returnData.json.routedTo);

return returnData;