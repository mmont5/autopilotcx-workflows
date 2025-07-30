# BookingAgent Node - DETERMINISTIC FIX

## Node to Replace: BookingAgent
**Current Issue:** This node is using LLM calls which cause slow responses and button bleed. We're replacing it with a deterministic state machine.

## Instructions:
1. In your N8N workflow, find the **BookingAgent** node (Code node)
2. Replace the entire JavaScript code in that node with the code below
3. Save the workflow
4. Test the booking flow

## New Code for BookingAgent Node:

```javascript
// DETERMINISTIC BOOKING AGENT - No LLMs, Fast & Reliable
// This replaces the LLM-based approach with a deterministic state machine

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
let updatedBookingData = { ...parsedBookingData };

// RESPONSE VARIATIONS FOR HUMAN-LIKE INTERACTIONS
const responseVariations = {
  welcome: [
    `Hi there! I'm ${agentName}, and I'm here to help you get the care you need at ${companyName}. I understand you might be experiencing discomfort, so I want to make this process as gentle and quick as possible. I'm here to support you every step of the way.`,
    `Hello! I'm ${agentName}, your care coordinator at ${companyName}. I know you may be in pain, and I want to help you get relief quickly. Let me guide you through booking your appointment in the most caring way possible.`,
    `Hi! I'm ${agentName}, and I'm here to help you at ${companyName}. I understand this might be a difficult time, and I want to make booking your appointment as smooth and supportive as possible. I'm here for you.`
  ],
  patientType: [
    "I'd be happy to help you book your appointment. Are you a new patient or an existing patient? This helps me provide you with the most personalized care.",
    "To give you the best care possible, I need to know if you're a new patient or an existing patient. This helps me prepare everything we need for your visit.",
    "I want to make sure I have all the right information for you. Are you a new patient or an existing patient with us?"
  ],
  nameRequest: [
    "Thank you! I'd love to help you get scheduled. What's your first name and last name? I want to make sure we have everything ready for your visit.",
    "Perfect! To get you scheduled, I need your first name and last name. This helps us prepare your file and ensure a smooth check-in process.",
    "Great! I'm here to help you get scheduled. Could you please share your first name and last name with me?"
  ],
  locationSelection: [
    "Which location is most convenient for you? I want to make sure you can get to your appointment easily.",
    "We have several locations to serve you better. Which one would work best for your schedule and location?",
    "To help you get scheduled at the right place, which location would be most convenient for you?"
  ],
  painLevel: [
    "I understand this might be difficult to talk about, and I want you to know that it's okay to share with me. I know you may be in pain, and I want to help you get relief quickly. On a scale of 1 to 10, how would you rate your pain level right now? I'm here to listen and help.",
    "I know pain can be really challenging, and I want to help you get the care you need. On a scale of 1 to 10, how would you describe your pain level? This helps us understand how to best support you.",
    "I understand pain can be overwhelming, and I'm here to help. On a scale of 1 to 10, how would you rate your current pain level? This information helps us provide the most appropriate care."
  ],
  symptoms: [
    "Thank you for sharing that with me. I know it can be difficult to talk about symptoms, and I appreciate you trusting me with this information. Could you tell me a bit more about what you're experiencing? I'm here to listen and help.",
    "I understand this might be uncomfortable to discuss, and I want you to know I'm here to support you. Could you describe what symptoms you're experiencing? This helps us prepare for your visit.",
    "Thank you for being open with me about your pain level. I know this can be difficult to talk about. Could you tell me more about what symptoms you're experiencing? I'm here to help."
  ],
  procedure: [
    "I want to make sure we get you scheduled for the right type of care. What procedure or treatment are you interested in? I'm here to help you understand your options.",
    "To help you get the most appropriate care, what procedure or treatment are you looking for? I want to make sure we have everything ready for your visit.",
    "I want to ensure you get the right care for your needs. What procedure or treatment are you interested in?"
  ],
  insurance: [
    "I want to make sure we handle your insurance properly so you don't have any surprises. What insurance do you have? I'm here to help you understand your coverage.",
    "To help you with insurance verification and avoid any billing issues, what insurance provider do you have? I want to make sure everything is set up correctly for you.",
    "I want to ensure your insurance is properly handled. What insurance provider do you have? This helps us verify your benefits."
  ],
  confirmation: [
    "Perfect! I have all the information I need to help you get scheduled. Let me confirm what I have so far to make sure everything is correct.",
    "Great! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
    "Excellent! I want to ensure I have all your information correct. Let me confirm what we've covered so far."
  ],
  completion: [
    "Thank you so much for trusting us with your care. I've collected all the information we need, and our team will be in touch shortly to confirm your appointment details. I know you may be in pain, and I want you to know we're here to help you get relief as quickly as possible.",
    "I appreciate you taking the time to share your information with me. I've gathered everything we need, and our team will contact you soon to finalize your appointment. I understand you may be experiencing discomfort, and we're committed to helping you get the care you need.",
    "Thank you for choosing us for your care. I have all the information we need, and our team will reach out shortly to confirm your appointment. I know this might be a difficult time, and we're here to support you every step of the way."
  ]
};

// Helper function to get random variation
function getRandomVariation(category) {
  const variations = responseVariations[category] || ["I'm here to help you."];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Helper function to format response with dynamic data
function formatResponse(template, data = {}) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    return data[key.trim()] || match;
  });
}

// STATE MACHINE LOGIC
switch (bookingState) {
  case "initial":
    response = getRandomVariation("welcome");
    suggestedActions = [
      { text: "New Patient", action: "new_patient" },
      { text: "Existing Patient", action: "existing_patient" }
    ];
    nextState = "patient_type_selected";
    break;
    
  case "patient_type_selected":
    if (userAction === "new_patient" || userInput.includes("new")) {
      response = getRandomVariation("nameRequest");
      suggestedActions = [];
      nextState = "collecting_name";
      updatedBookingData.patientType = "new";
    } else if (userAction === "existing_patient" || userInput.includes("existing")) {
      response = getRandomVariation("nameRequest");
      suggestedActions = [];
      nextState = "collecting_name";
      updatedBookingData.patientType = "existing";
    } else {
      response = "I didn't quite catch that. Are you a new patient or an existing patient?";
      suggestedActions = [
        { text: "New Patient", action: "new_patient" },
        { text: "Existing Patient", action: "existing_patient" }
      ];
    }
    break;
    
  case "collecting_name":
    if (userInput && userInput.trim()) {
      // Extract name from input
      const nameParts = userInput.trim().split(" ");
      if (nameParts.length >= 2) {
        updatedBookingData.firstName = nameParts[0];
        updatedBookingData.lastName = nameParts.slice(1).join(" ");
        response = "Thank you! What's your date of birth? (MM/DD/YYYY)";
        suggestedActions = [];
        nextState = "collecting_dob";
      } else {
        response = "I need both your first name and last name. Could you please provide your full name?";
        suggestedActions = [];
      }
    } else {
      response = "I need your first name and last name to help you get scheduled. Could you please provide your full name?";
      suggestedActions = [];
    }
    break;
    
  case "collecting_dob":
    if (userInput && userInput.trim()) {
      updatedBookingData.dateOfBirth = userInput.trim();
      response = "Thank you! What's your phone number?";
      suggestedActions = [];
      nextState = "collecting_phone";
    } else {
      response = "I need your date of birth to help you get scheduled. Could you please provide it in MM/DD/YYYY format?";
      suggestedActions = [];
    }
    break;
    
  case "collecting_phone":
    if (userInput && userInput.trim()) {
      updatedBookingData.phone = userInput.trim();
      response = "Thank you! What's your email address?";
      suggestedActions = [];
      nextState = "collecting_email";
    } else {
      response = "I need your phone number to help you get scheduled. Could you please provide it?";
      suggestedActions = [];
    }
    break;
    
  case "collecting_email":
    if (userInput && userInput.trim()) {
      updatedBookingData.email = userInput.trim();
      response = getRandomVariation("locationSelection");
      suggestedActions = [
        { text: "Old Bridge", action: "location_old_bridge" },
        { text: "Jersey City", action: "location_jersey_city" },
        { text: "South Plainfield", action: "location_south_plainfield" }
      ];
      nextState = "collecting_location";
    } else {
      response = "I need your email address to help you get scheduled. Could you please provide it?";
      suggestedActions = [];
    }
    break;
    
  case "collecting_location":
    if (userAction && userAction.startsWith("location_")) {
      const location = userAction.replace("location_", "").replace("_", " ");
      updatedBookingData.location = location;
      response = getRandomVariation("painLevel");
      suggestedActions = [
        { text: "1", action: "pain_1" },
        { text: "2", action: "pain_2" },
        { text: "3", action: "pain_3" },
        { text: "4", action: "pain_4" },
        { text: "5", action: "pain_5" },
        { text: "6", action: "pain_6" },
        { text: "7", action: "pain_7" },
        { text: "8", action: "pain_8" },
        { text: "9", action: "pain_9" },
        { text: "10", action: "pain_10" }
      ];
      nextState = "collecting_pain_level";
    } else if (userInput && userInput.trim()) {
      updatedBookingData.location = userInput.trim();
      response = getRandomVariation("painLevel");
      suggestedActions = [
        { text: "1", action: "pain_1" },
        { text: "2", action: "pain_2" },
        { text: "3", action: "pain_3" },
        { text: "4", action: "pain_4" },
        { text: "5", action: "pain_5" },
        { text: "6", action: "pain_6" },
        { text: "7", action: "pain_7" },
        { text: "8", action: "pain_8" },
        { text: "9", action: "pain_9" },
        { text: "10", action: "pain_10" }
      ];
      nextState = "collecting_pain_level";
    } else {
      response = "Which location would you prefer? We have Old Bridge, Jersey City, and South Plainfield.";
      suggestedActions = [
        { text: "Old Bridge", action: "location_old_bridge" },
        { text: "Jersey City", action: "location_jersey_city" },
        { text: "South Plainfield", action: "location_south_plainfield" }
      ];
    }
    break;
    
  case "collecting_pain_level":
    if (userAction && userAction.startsWith("pain_")) {
      const painLevel = userAction.replace("pain_", "");
      updatedBookingData.painLevel = painLevel;
      response = getRandomVariation("symptoms");
      suggestedActions = [];
      nextState = "collecting_symptoms";
    } else if (userInput && userInput.trim()) {
      // Try to extract pain level from text
      const painMatch = userInput.match(/(\d+)/);
      if (painMatch && parseInt(painMatch[1]) >= 1 && parseInt(painMatch[1]) <= 10) {
        updatedBookingData.painLevel = painMatch[1];
        response = getRandomVariation("symptoms");
        suggestedActions = [];
        nextState = "collecting_symptoms";
      } else {
        response = "I need to know your pain level on a scale of 1 to 10. Could you please provide a number between 1 and 10?";
        suggestedActions = [
          { text: "1", action: "pain_1" },
          { text: "2", action: "pain_2" },
          { text: "3", action: "pain_3" },
          { text: "4", action: "pain_4" },
          { text: "5", action: "pain_5" },
          { text: "6", action: "pain_6" },
          { text: "7", action: "pain_7" },
          { text: "8", action: "pain_8" },
          { text: "9", action: "pain_9" },
          { text: "10", action: "pain_10" }
        ];
      }
    } else {
      response = "I need to know your pain level on a scale of 1 to 10. Could you please provide a number between 1 and 10?";
      suggestedActions = [
        { text: "1", action: "pain_1" },
        { text: "2", action: "pain_2" },
        { text: "3", action: "pain_3" },
        { text: "4", action: "pain_4" },
        { text: "5", action: "pain_5" },
        { text: "6", action: "pain_6" },
        { text: "7", action: "pain_7" },
        { text: "8", action: "pain_8" },
        { text: "9", action: "pain_9" },
        { text: "10", action: "pain_10" }
      ];
    }
    break;
    
  case "collecting_symptoms":
    if (userInput && userInput.trim()) {
      updatedBookingData.symptoms = userInput.trim();
      response = getRandomVariation("procedure");
      suggestedActions = [
        { text: "Spine Surgery", action: "procedure_spine_surgery" },
        { text: "Spine Treatment (Non-Surgical)", action: "procedure_spine_treatment" },
        { text: "Podiatry", action: "procedure_podiatry" },
        { text: "General Orthopedics/Extremity", action: "procedure_general_orthopedics" }
      ];
      nextState = "collecting_procedure";
    } else {
      response = "Could you please tell me about your symptoms? This helps us understand how to best help you.";
      suggestedActions = [];
    }
    break;
    
  case "collecting_procedure":
    if (userAction && userAction.startsWith("procedure_")) {
      const procedure = userAction.replace("procedure_", "").replace(/_/g, " ");
      updatedBookingData.procedure = procedure;
      response = getRandomVariation("insurance");
      suggestedActions = [
        { text: "Aetna", action: "insurance_aetna" },
        { text: "Blue Cross Blue Shield", action: "insurance_bcbs" },
        { text: "Cigna", action: "insurance_cigna" },
        { text: "UnitedHealthcare", action: "insurance_united" },
        { text: "Humana", action: "insurance_humana" },
        { text: "Other", action: "insurance_other" }
      ];
      nextState = "collecting_insurance";
    } else if (userInput && userInput.trim()) {
      updatedBookingData.procedure = userInput.trim();
      response = getRandomVariation("insurance");
      suggestedActions = [
        { text: "Aetna", action: "insurance_aetna" },
        { text: "Blue Cross Blue Shield", action: "insurance_bcbs" },
        { text: "Cigna", action: "insurance_cigna" },
        { text: "UnitedHealthcare", action: "insurance_united" },
        { text: "Humana", action: "insurance_humana" },
        { text: "Other", action: "insurance_other" }
      ];
      nextState = "collecting_insurance";
    } else {
      response = "What procedure or treatment are you interested in? We offer spine surgery, non-surgical spine treatment, podiatry, and general orthopedics.";
      suggestedActions = [
        { text: "Spine Surgery", action: "procedure_spine_surgery" },
        { text: "Spine Treatment (Non-Surgical)", action: "procedure_spine_treatment" },
        { text: "Podiatry", action: "procedure_podiatry" },
        { text: "General Orthopedics/Extremity", action: "procedure_general_orthopedics" }
      ];
    }
    break;
    
  case "collecting_insurance":
    if (userAction && userAction.startsWith("insurance_")) {
      const insurance = userAction.replace("insurance_", "").replace(/_/g, " ");
      updatedBookingData.insurance = insurance;
      response = "Thank you! Is there any additional information you'd like to share with us? This helps us prepare for your visit.";
      suggestedActions = [];
      nextState = "collecting_additional_info";
    } else if (userInput && userInput.trim()) {
      updatedBookingData.insurance = userInput.trim();
      response = "Thank you! Is there any additional information you'd like to share with us? This helps us prepare for your visit.";
      suggestedActions = [];
      nextState = "collecting_additional_info";
    } else {
      response = "What insurance do you have? We accept most major insurance providers.";
      suggestedActions = [
        { text: "Aetna", action: "insurance_aetna" },
        { text: "Blue Cross Blue Shield", action: "insurance_bcbs" },
        { text: "Cigna", action: "insurance_cigna" },
        { text: "UnitedHealthcare", action: "insurance_united" },
        { text: "Humana", action: "insurance_humana" },
        { text: "Other", action: "insurance_other" }
      ];
    }
    break;
    
  case "collecting_additional_info":
    if (userInput && userInput.trim()) {
      updatedBookingData.additionalInfo = userInput.trim();
    }
    response = getRandomVariation("confirmation");
    response += "\n\nHere's what I have:";
    response += `\n• Name: ${updatedBookingData.firstName} ${updatedBookingData.lastName}`;
    response += `\n• Date of Birth: ${updatedBookingData.dateOfBirth}`;
    response += `\n• Phone: ${updatedBookingData.phone}`;
    response += `\n• Email: ${updatedBookingData.email}`;
    response += `\n• Location: ${updatedBookingData.location}`;
    response += `\n• Pain Level: ${updatedBookingData.painLevel}/10`;
    response += `\n• Symptoms: ${updatedBookingData.symptoms}`;
    response += `\n• Procedure: ${updatedBookingData.procedure}`;
    response += `\n• Insurance: ${updatedBookingData.insurance}`;
    if (updatedBookingData.additionalInfo) {
      response += `\n• Additional Info: ${updatedBookingData.additionalInfo}`;
    }
    response += "\n\nIs this information correct?";
    suggestedActions = [
      { text: "Yes, that's correct", action: "confirm_booking" },
      { text: "No, I need to make changes", action: "edit_booking" }
    ];
    nextState = "confirmation";
    break;
    
  case "confirmation":
    if (userAction === "confirm_booking" || userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("correct")) {
      response = getRandomVariation("completion");
      suggestedActions = [];
      nextState = "complete";
    } else {
      response = "I understand you'd like to make changes. Let me know what information needs to be corrected.";
      suggestedActions = [];
      nextState = "collecting_additional_info";
    }
    break;
    
  default:
    response = "I'm here to help you book your appointment. Let's start fresh. Are you a new patient or an existing patient?";
    suggestedActions = [
      { text: "New Patient", action: "new_patient" },
      { text: "Existing Patient", action: "existing_patient" }
    ];
    nextState = "patient_type_selected";
    break;
}

// RETURN RESPONSE
return {
  json: {
    ...item.json,
    agent_response: response,
    suggestedActions,
    bookingState: nextState,
    bookingData: JSON.stringify(updatedBookingData),
    conversation_stage: nextState === "complete" ? "booking_complete" : "booking_in_progress",
    timestamp: new Date().toISOString()
  }
};
```

## What This Fix Does:

1. **ELIMINATES LLM CALLS** - No more slow responses
2. **FIXES BUTTON BLEED** - Explicitly manages `suggestedActions` array
3. **DETERMINISTIC STATE MACHINE** - Predictable, fast responses
4. **HUMAN-LIKE VARIATIONS** - 3 variations for each response type
5. **COMPLETE BOOKING FLOW** - All 15 steps from Dr. Hassan's requirements
6. **DYNAMIC DATA** - Uses company name and agent name from context

## Next Steps:
1. Copy this code into your **BookingAgent** node in N8N
2. Save the workflow
3. Test the booking flow
4. Export the updated JSON
5. I'll then examine the exported JSON and provide the next node fix

This should immediately fix your slow response and button bleed issues! 