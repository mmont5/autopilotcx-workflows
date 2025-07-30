# Deterministic Booking Flow - No LLMs

## **Overview**
This replaces the LLM-driven booking flow with a simple, reliable state machine that handles all booking steps deterministically.

## **Booking States**
1. `initial` - Welcome message with New Patient/Existing Patient buttons
2. `patient_type_selected` - User selected patient type, ask for name
3. `collecting_name` - Collecting First Name and Last Name
4. `collecting_dob` - Collecting Date of Birth
5. `collecting_phone` - Collecting Phone Number
6. `collecting_email` - Collecting Email Address
7. `collecting_location` - Selecting location (Old Bridge, Jersey City, South Plainfield)
8. `collecting_pain_level` - Pain level 1-10
9. `collecting_symptoms` - Free text symptoms
10. `collecting_procedure` - Selecting procedure/treatment
11. `collecting_insurance` - Insurance provider selection
12. `collecting_insurance_details` - Additional insurance verification
13. `collecting_additional_info` - Any additional information
14. `confirmation` - Confirm all collected information
15. `complete` - Booking completed

## **Code for "Deterministic Booking Agent" Node**

Replace the "Build Booking Prompt" node with this:

```javascript
// DETERMINISTIC BOOKING AGENT - No LLMs
// Simple state machine for reliable booking flow

console.log("🚀 DETERMINISTIC BOOKING: Processing state:", $json.bookingState);

const agentName = $json.agentName || "Olivia";
const companyName = $json.companyName || "Hassan Spine & Sports Medicine";
let bookingState = $json.bookingState || "initial";
const parsedBookingData = $json.bookingData ? JSON.parse($json.bookingData) : {};
const userInput = $json.message || $json.user_message || "";
const userAction = $json.userAction || "";

console.log("🚀 DETERMINISTIC BOOKING - Input:", userInput);
console.log("🚀 DETERMINISTIC BOOKING - Action:", userAction);
console.log("🚀 DETERMINISTIC BOOKING - Current State:", bookingState);

// STATE MACHINE LOGIC
let response = "";
let suggestedActions = [];
let nextState = bookingState;

// Handle user actions and state transitions
if (userAction === "new_patient" || userAction === "existing_patient") {
  bookingState = "patient_type_selected";
  nextState = "collecting_name";
  const patientType = userAction === "new_patient" ? "new" : "existing";
  response = `Thank you so much for letting me know you're a ${patientType} patient. I'm here to make this as easy as possible for you. Could you please share your <span style="font-weight: bold; color: orange;">First Name and Last Name</span> with me?`;
} else if (userAction === "location_old_bridge") {
  parsedBookingData.location = "Old Bridge";
  bookingState = "collecting_pain_level";
  nextState = "collecting_pain_level";
  response = `Perfect! Old Bridge is a great choice. Now, I understand this might be difficult to talk about, but it helps us understand your situation better so we can get you the right care. On a scale of 1 to 10, how would you rate your pain level right now?`;
  suggestedActions = [
    { text: "1", action: "pain_level_1" },
    { text: "2", action: "pain_level_2" },
    { text: "3", action: "pain_level_3" },
    { text: "4", action: "pain_level_4" },
    { text: "5", action: "pain_level_5" },
    { text: "6", action: "pain_level_6" },
    { text: "7", action: "pain_level_7" },
    { text: "8", action: "pain_level_8" },
    { text: "9", action: "pain_level_9" },
    { text: "10", action: "pain_level_10" }
  ];
} else if (userAction === "location_jersey_city") {
  parsedBookingData.location = "Jersey City";
  bookingState = "collecting_pain_level";
  nextState = "collecting_pain_level";
  response = `Perfect! Jersey City is a great choice. Now, I understand this might be difficult to talk about, but it helps us understand your situation better so we can get you the right care. On a scale of 1 to 10, how would you rate your pain level right now?`;
  suggestedActions = [
    { text: "1", action: "pain_level_1" },
    { text: "2", action: "pain_level_2" },
    { text: "3", action: "pain_level_3" },
    { text: "4", action: "pain_level_4" },
    { text: "5", action: "pain_level_5" },
    { text: "6", action: "pain_level_6" },
    { text: "7", action: "pain_level_7" },
    { text: "8", action: "pain_level_8" },
    { text: "9", action: "pain_level_9" },
    { text: "10", action: "pain_level_10" }
  ];
} else if (userAction === "location_south_plainfield") {
  parsedBookingData.location = "South Plainfield";
  bookingState = "collecting_pain_level";
  nextState = "collecting_pain_level";
  response = `Perfect! South Plainfield is a great choice. Now, I understand this might be difficult to talk about, but it helps us understand your situation better so we can get you the right care. On a scale of 1 to 10, how would you rate your pain level right now?`;
  suggestedActions = [
    { text: "1", action: "pain_level_1" },
    { text: "2", action: "pain_level_2" },
    { text: "3", action: "pain_level_3" },
    { text: "4", action: "pain_level_4" },
    { text: "5", action: "pain_level_5" },
    { text: "6", action: "pain_level_6" },
    { text: "7", action: "pain_level_7" },
    { text: "8", action: "pain_level_8" },
    { text: "9", action: "pain_level_9" },
    { text: "10", action: "pain_level_10" }
  ];
} else if (userAction.startsWith("pain_level_")) {
  const painLevel = userAction.replace("pain_level_", "");
  parsedBookingData.painLevel = painLevel;
  bookingState = "collecting_symptoms";
  nextState = "collecting_symptoms";
  response = `Thank you for sharing that with me. Could you please describe your symptoms? This helps us understand what you're experiencing.`;
} else if (userAction.startsWith("procedure_")) {
  const procedure = userAction.replace("procedure_", "").replace(/_/g, " ");
  parsedBookingData.procedure = procedure;
  bookingState = "collecting_insurance";
  nextState = "collecting_insurance";
  response = `Great! What insurance do you have? (Note: We do not accept Medicare or Medicaid at this time.)`;
  suggestedActions = [
    { text: "Aetna", action: "insurance_aetna" },
    { text: "Blue Cross Blue Shield", action: "insurance_bcbs" },
    { text: "Cigna", action: "insurance_cigna" },
    { text: "UnitedHealthcare", action: "insurance_united" },
    { text: "Humana", action: "insurance_humana" },
    { text: "Other", action: "insurance_other" }
  ];
} else if (userAction.startsWith("insurance_")) {
  const insurance = userAction.replace("insurance_", "").replace(/_/g, " ");
  parsedBookingData.insurance = insurance;
  bookingState = "collecting_insurance_details";
  nextState = "collecting_insurance_details";
  response = `Thank you! For insurance verification, I need a few more details. Could you please provide your Policy Holder Name?`;
} else {
  // Handle text input based on current state
  switch (bookingState) {
    case "initial":
      response = `Hi there! I'm ${agentName}, and I'm here to help you get the care you need at ${companyName}. I understand this might be a difficult time for you, and I want to make this process as gentle and smooth as possible. To get started, could you please let me know if you're a:`;
      suggestedActions = [
        { text: "New Patient", action: "new_patient" },
        { text: "Existing Patient", action: "existing_patient" }
      ];
      break;
      
    case "collecting_name":
      if (userInput && userInput.trim()) {
        const nameParts = userInput.trim().split(' ').filter(part => part.length > 0);
        if (nameParts.length >= 2) {
          parsedBookingData.firstName = nameParts[0];
          parsedBookingData.lastName = nameParts.slice(1).join(' ');
          parsedBookingData.fullName = userInput.trim();
          bookingState = "collecting_dob";
          nextState = "collecting_dob";
          response = `Thank you ${parsedBookingData.firstName}! I have ${parsedBookingData.fullName} as your name. Could you please share your <span style="font-weight: bold; color: orange;">Date of Birth</span>? (Example: 01/15/1985)`;
        } else {
          response = `I need both your first and last name. Could you please provide your complete name?`;
        }
      }
      break;
      
    case "collecting_dob":
      if (userInput && userInput.trim()) {
        parsedBookingData.dateOfBirth = userInput.trim();
        bookingState = "collecting_phone";
        nextState = "collecting_phone";
        response = `Perfect! Now could you please share your <span style="font-weight: bold; color: orange;">Phone Number</span>? This helps us reach you if we need to confirm anything about your appointment. (Example: +15031234567)`;
      }
      break;
      
    case "collecting_phone":
      if (userInput && userInput.trim()) {
        parsedBookingData.phone = userInput.trim();
        bookingState = "collecting_email";
        nextState = "collecting_email";
        response = `Great! And could you please share your <span style="font-weight: bold; color: orange;">Email Address</span>?`;
      }
      break;
      
    case "collecting_email":
      if (userInput && userInput.trim()) {
        parsedBookingData.email = userInput.trim();
        bookingState = "collecting_location";
        nextState = "collecting_location";
        response = `Excellent! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.`;
        suggestedActions = [
          { text: "Old Bridge", action: "location_old_bridge" },
          { text: "Jersey City", action: "location_jersey_city" },
          { text: "South Plainfield", action: "location_south_plainfield" }
        ];
      }
      break;
      
    case "collecting_symptoms":
      if (userInput && userInput.trim()) {
        parsedBookingData.symptoms = userInput.trim();
        bookingState = "collecting_procedure";
        nextState = "collecting_procedure";
        response = `Thank you for sharing your symptoms. What procedure or treatment are you interested in?`;
        suggestedActions = [
          { text: "Spine Surgery", action: "procedure_spine_surgery" },
          { text: "Non-Surgical Treatment", action: "procedure_non_surgical" },
          { text: "Podiatry", action: "procedure_podiatry" },
          { text: "Orthopedics", action: "procedure_orthopedics" },
          { text: "PRP Therapy", action: "procedure_prp_therapy" },
          { text: "Radiofrequency Ablation", action: "procedure_radiofrequency" },
          { text: "Spinal Cord Stimulation", action: "procedure_spinal_cord" },
          { text: "Consultation", action: "procedure_consultation" }
        ];
      }
      break;
      
    case "collecting_insurance_details":
      if (userInput && userInput.trim()) {
        if (!parsedBookingData.insuranceDetails) {
          parsedBookingData.insuranceDetails = {};
        }
        if (!parsedBookingData.insuranceDetails.policyHolder) {
          parsedBookingData.insuranceDetails.policyHolder = userInput.trim();
          response = `Thank you! Now I need your Insurance ID Number.`;
        } else if (!parsedBookingData.insuranceDetails.idNumber) {
          parsedBookingData.insuranceDetails.idNumber = userInput.trim();
          response = `Thank you! Now I need your Group Number.`;
        } else if (!parsedBookingData.insuranceDetails.groupNumber) {
          parsedBookingData.insuranceDetails.groupNumber = userInput.trim();
          bookingState = "collecting_additional_info";
          nextState = "collecting_additional_info";
          response = `Perfect! Any additional information you'd like to provide? (This is optional)`;
        }
      }
      break;
      
    case "collecting_additional_info":
      if (userInput && userInput.trim()) {
        parsedBookingData.additionalInfo = userInput.trim();
      }
      // Move to confirmation regardless
      bookingState = "confirmation";
      nextState = "confirmation";
      
      // Build confirmation message
      const confirmationText = `Perfect! Let me confirm your information:

**Patient Information:**
- Name: ${parsedBookingData.fullName}
- Date of Birth: ${parsedBookingData.dateOfBirth}
- Phone: ${parsedBookingData.phone}
- Email: ${parsedBookingData.email}

**Appointment Details:**
- Location: ${parsedBookingData.location}
- Pain Level: ${parsedBookingData.painLevel}/10
- Symptoms: ${parsedBookingData.symptoms}
- Procedure: ${parsedBookingData.procedure}
- Insurance: ${parsedBookingData.insurance}

${parsedBookingData.additionalInfo ? `**Additional Information:** ${parsedBookingData.additionalInfo}` : ''}

Is this information correct? Would you like to proceed with scheduling your appointment?`;
      
      response = confirmationText;
      suggestedActions = [
        { text: "Yes, Schedule Appointment", action: "confirm_booking" },
        { text: "No, Let Me Edit", action: "edit_booking" }
      ];
      break;
      
    case "confirmation":
      if (userAction === "confirm_booking") {
        bookingState = "complete";
        nextState = "complete";
        response = `Excellent! Your appointment request has been submitted. Our team will contact you within 24 hours to confirm your appointment time. Thank you for choosing ${companyName}!`;
      } else if (userAction === "edit_booking") {
        bookingState = "initial";
        nextState = "initial";
        response = `No problem! Let's start over. To get started, could you please let me know if you're a:`;
        suggestedActions = [
          { text: "New Patient", action: "new_patient" },
          { text: "Existing Patient", action: "existing_patient" }
        ];
      }
      break;
      
    default:
      response = `I'm here to help you with your appointment. Could you please let me know what specific information you need?`;
      break;
  }
}

console.log("🚀 DETERMINISTIC BOOKING - Response:", response);
console.log("🚀 DETERMINISTIC BOOKING - Next State:", nextState);
console.log("🚀 DETERMINISTIC BOOKING - Buttons:", suggestedActions);

// Return the response without LLM processing
return [{
  json: {
    ...$json,
    agent_response: response,
    bookingState: nextState,
    bookingData: JSON.stringify(parsedBookingData),
    suggestedActions: suggestedActions,
    skipLLM: true, // Skip LLM processing
    timestamp: new Date().toISOString()
  },
  pairedItem: {
    item: 0
  }
}];
```

## **Update Intent Classifier**

The Intent Classifier should route to this new deterministic flow:

```javascript
// In Intent Classifier, when intent === "appointment"
if (detectedIntent === "appointment") {
  nextAgent = "DeterministicBookingAgent"; // New agent name
}
```

## **Benefits of This Approach**

✅ **No LLM Latency** - Instant responses
✅ **Predictable State Transitions** - No confusion about next steps
✅ **Easy Testing** - Each state can be tested independently
✅ **Reliable Button Management** - Buttons only appear when needed
✅ **Fast Debugging** - Clear state flow and data collection
✅ **Consistent Experience** - Same flow every time

## **Next Steps**

1. Replace the "Build Booking Prompt" node with this deterministic flow
2. Update the Intent Classifier to route to "DeterministicBookingAgent"
3. Test each state transition
4. Add any missing procedures or insurance options
5. Deploy and test with real users

This will give you a rock-solid booking flow that works every time! 