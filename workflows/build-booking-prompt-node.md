# Build Booking Prompt Node - SIMPLIFIED FIX

## **Updated Code for "Build Booking Prompt" Node**

**Replace the entire code in the "Build Booking Prompt" node with:**

```javascript
// SIMPLIFIED FIX: Build Booking Prompt Node
// Handles everything without relying on Restore Buttons After LLM node

console.log("🚀 SIMPLIFIED: Generating LLM prompt with direct button handling");

const agentName = $json.agentName || "Olivia";
const companyName = $json.companyName || "Hassan Spine & Sports Medicine";
let bookingState = $json.bookingState || "initial";
const parsedBookingData = $json.bookingData || {};
let detectedAction = $json.userAction || "";
const userInput = $json.message || $json.user_message || "";

// CRITICAL FIX: Detect if user provided their name and advance state
if (bookingState === "collecting_name" && userInput && userInput.trim()) {
  // Check if user input looks like a name (has at least 2 words)
  const nameParts = userInput.trim().split(' ').filter(part => part.length > 0);
  if (nameParts.length >= 2) {
    bookingState = "collecting_dob";
    console.log("🚀 STATE ADVANCED: User provided name, advancing to collecting_dob");
  }
}

// CRITICAL FIX: Only show buttons in initial state, clear them for all other states
let suggestedActions = [];

// Only generate buttons if we're in the initial state
if (bookingState === "initial" || bookingState === "patient_type") {
  console.log("🚀 GENERATING BUTTONS: New Patient/Existing Patient buttons for initial state");
  suggestedActions = [
    { text: "New Patient", action: "new_patient" },
    { text: "Existing Patient", action: "existing_patient" }
  ];
} else {
  console.log("🚀 NO BUTTONS: Advanced past initial state, clearing buttons");
  suggestedActions = []; // No buttons for any other state
}

console.log("🚀 BUTTONS DEBUG: suggestedActions:", suggestedActions);
console.log("🚀 STATE DEBUG: bookingState:", bookingState, "userInput:", userInput);

// Build the conversation history
const userMessage = $json.message || $json.user_message || "";

// DETERMINE THE EXACT RESPONSE BASED ON STATE
let exactResponse = "";

if (bookingState === "initial" || bookingState === "patient_type") {
  exactResponse = `Hi there! I'm ${agentName}, and I'm here to help you get the care you need at ${companyName}. I understand this might be a difficult time for you, and I want to make this process as gentle and smooth as possible. To get started, could you please let me know if you're a:`;
} else if (detectedAction === "new_patient" || detectedAction === "existing_patient" || bookingState === "collecting_name") {
  const patientType = detectedAction === "new_patient" ? "new" : "existing";
  exactResponse = `Thank you so much for letting me know you're a ${patientType} patient. I'm here to make this as easy as possible for you. Could you please share your <span style="font-weight: bold; color: orange;">First Name and Last Name</span> with me?`;
} else if (bookingState === "collecting_dob") {
  const firstName = parsedBookingData.firstName || "there";
  const lastName = parsedBookingData.lastName || "";
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  exactResponse = `Thank you ${firstName}! I have ${fullName} as your name. Could you please share your <span style="font-weight: bold; color: orange;">Date of Birth</span>? (Example: 01/15/1985)`;
} else if (bookingState === "collecting_phone") {
  exactResponse = `Perfect! Now could you please share your <span style="font-weight: bold; color: orange;">Phone Number</span>? This helps us reach you if we need to confirm anything about your appointment. (Example: +15031234567)`;
} else if (bookingState === "collecting_email") {
  exactResponse = `Great! And could you please share your <span style="font-weight: bold; color: orange;">Email Address</span>?`;
} else if (bookingState === "collecting_location") {
  exactResponse = `Excellent! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.`;
} else if (bookingState === "collecting_pain_level") {
  const location = parsedBookingData.location || "your preferred location";
  exactResponse = `Perfect! ${location} is a great choice. Now, I understand this might be difficult to talk about, but it helps us understand your situation better so we can get you the right care. On a scale of 1 to 10, how would you rate your pain level right now?`;
} else if (bookingState === "collecting_symptoms") {
  exactResponse = `Thank you for sharing that with me. Could you please describe your symptoms? This helps us understand what you're experiencing.`;
} else if (bookingState === "collecting_procedure") {
  exactResponse = `Thank you for sharing your symptoms. What procedure or treatment are you interested in?`;
} else if (bookingState === "collecting_insurance") {
  exactResponse = `Great! What insurance do you have? (Note: We do not accept Medicare or Medicaid at this time.)`;
} else {
  // Default response for other states
  exactResponse = `I'm here to help you with your appointment. Could you please let me know what specific information you need?`;
}

// SIMPLIFIED PROMPT: Just tell the LLM to use the exact response
const finalPrompt = `
You are ${agentName}, a caring healthcare assistant at ${companyName}.

EXACT RESPONSE TO USE: "${exactResponse}"

Respond with exactly this text and nothing else.

Patient: ${userMessage}
${agentName}:
`;

// Return prompt for LLM processing with correct buttons
return [{
  json: {
    ...$json,
    prompt: finalPrompt,
    userMessage,
    bookingState, // CRITICAL: Pass the updated booking state
    bookingData: parsedBookingData,
    userAction: detectedAction,
    skipLLM: false, // ALWAYS allow LLM processing
    suggestedActions // CRITICAL: Only buttons for initial state
  },
  pairedItem: {
    item: 0
  }
}];
```

## **Key Fixes:**

1. **Simplified Approach** - Removes dependency on Restore Buttons After LLM node
2. **Direct Response Generation** - LLM gets exact response to use
3. **Button Logic Fixed** - Only show buttons in initial state
4. **State Advancement Detection** - Detects when user provides name and advances to next state
5. **Debug Logging** - Shows state changes for troubleshooting

## **Expected Results:**

- **First Response**: Warm greeting with "New Patient" and "Existing Patient" buttons
- **Second Response**: Ask for name with NO buttons
- **Third Response**: Ask for date of birth with NO buttons
- **Subsequent Responses**: Continue advancing through booking flow with NO buttons

This simplified approach should fix the missing 2nd response issue! 