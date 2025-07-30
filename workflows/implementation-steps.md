# Implementation Steps - Deterministic Booking Flow

## **Step 1: Update Intent Classifier**

Replace the Intent Classifier node code with this updated version:

```javascript
// UPDATED INTENT CLASSIFIER - Routes to Deterministic Booking Agent
return items.map((item, i) => {
  try {
    const input = (item.json.message || "").toLowerCase();
    let bookingState = $json.bookingState || "";
    let bookingData = $json.bookingData || "{}";

    console.log("🔧 DEBUG - Intent Classifier - Input:", input);
    console.log("🔧 DEBUG - Intent Classifier - Booking State:", bookingState);

    // CRITICAL: If in active booking session, ALWAYS route to Deterministic Booking Agent
    if (bookingState && bookingState !== "complete" && bookingState !== "" && bookingState !== "initial") {
      console.log("🔧 DEBUG - Intent Classifier - Active booking session, routing to Deterministic Booking Agent");
      return {
        json: {
          ...item.json,
          intent: "appointment",
          nextAgent: "DeterministicBookingAgent", // NEW AGENT NAME
          conversation_stage: "booking_in_progress",
          bookingState,
          bookingData
        },
        pairedItem: i
      };
    }

    // Enhanced Intent detection
    function detectIntent(input) {
      // Emergency detection
      if (input.includes("emergency") || input.includes("911") || input.includes("severe pain")) {
        return "escalate";
      }

      // Booking intent (PRIORITIZE)
      if (input.includes("book") || input.includes("appointment") || input.includes("schedule") || 
          input.includes("new patient") || input.includes("existing patient")) {
        return "appointment";
      }

      // Clinical intent
      if (input.includes("pain") || input.includes("hurt") || input.includes("ache") || 
          input.includes("back") || input.includes("neck") || input.includes("shoulder") || 
          input.includes("spine") || input.includes("injury") || input.includes("symptom")) {
        return "clinical";
      }

      // Billing intent
      if (input.includes("cost") || input.includes("insurance") || input.includes("coverage") || 
          input.includes("payment") || input.includes("copay")) {
        return "billing";
      }

      // Feedback intent
      if (input.includes("feedback") || input.includes("complaint") || input.includes("review")) {
        return "feedback";
      }

      // General questions
      if (input.includes("what") || input.includes("how") || input.includes("when") || 
          input.includes("where") || input.includes("why")) {
        return "general";
      }

      return "general";
    }

    const detectedIntent = detectIntent(input);
    let nextAgent = "";

    // Route to appropriate agent
    switch (detectedIntent) {
      case "appointment":
        nextAgent = "DeterministicBookingAgent"; // NEW AGENT NAME
        break;
      case "clinical":
        nextAgent = "ClinicalQAAgent";
        break;
      case "billing":
        nextAgent = "InsuranceBillingAgent";
        break;
      case "feedback":
        nextAgent = "FeedbackSupportAgent";
        break;
      case "escalate":
        nextAgent = "HumanAgent";
        break;
      default:
        nextAgent = "GeneralQAAgent";
        break;
    }

    console.log("🔧 DEBUG - Intent Classifier - Detected Intent:", detectedIntent);
    console.log("🔧 DEBUG - Intent Classifier - Next Agent:", nextAgent);

    return {
      json: {
        ...item.json,
        message: item.json.message,
        intent: detectedIntent,
        nextAgent,
        conversation_stage: detectedIntent === "appointment" ? "booking_start" : "",
        bookingState,
        bookingData,
        timestamp: new Date().toISOString()
      },
      pairedItem: i
    };

  } catch (error) {
    console.error("Intent classifier error:", error);
    return {
      json: {
        ...item.json,
        intent: "general",
        nextAgent: "GeneralQAAgent",
        bookingState: item.json.bookingState,
        bookingData: item.json.bookingData
      },
      pairedItem: i
    };
  }
});
```

## **Step 2: Replace Build Booking Prompt with Deterministic Booking Agent**

Replace the "Build Booking Prompt" node with this new "Deterministic Booking Agent" node:

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

## **Step 3: Update Switch Node**

Update the Switch node to route to the new agent names:

```json
{
  "parameters": {
    "rules": {
      "values": [
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "appointment",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "Deterministic Booking Agent"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "clinical",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "Clinical Q&A Agent"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "billing",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "Insurance/Billing Agent"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "feedback",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "Feedback/Support Agent"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "general",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "General Q&A Agent"
        },
        {
          "conditions": {
            "conditions": [
              {
                "leftValue": "intent",
                "rightValue": "escalate",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          },
          "outputKey": "Human Agent"
        }
      ]
    }
  }
}
```

## **Step 4: Create LLM Agents for Value-Add Branches**

### **Clinical Q&A Agent**
```javascript
// Clinical Q&A Agent - LLM for medical questions
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a medical assistant at Hassan Spine & Sports Medicine. Answer clinical questions with empathy and accuracy. Do not provide medical advice, only general information. Be kind and caring."
      },
      {
        role: "user",
        content: $json.message
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});

const data = await response.json();
return [{
  json: {
    ...$json,
    agent_response: data.choices[0].message.content,
    suggestedActions: []
  }
}];
```

### **Insurance/Billing Agent**
```javascript
// Insurance/Billing Agent - LLM for billing questions
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a billing specialist at Hassan Spine & Sports Medicine. Help with insurance questions, costs, and coverage. Be clear about what we accept and don't accept. We do not accept Medicare or Medicaid."
      },
      {
        role: "user",
        content: $json.message
      }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});

const data = await response.json();
return [{
  json: {
    ...$json,
    agent_response: data.choices[0].message.content,
    suggestedActions: []
  }
}];
```

## **Step 5: Test Each Branch**

### **Test Booking Flow:**
1. Send: "I want to book an appointment"
2. Should route to Deterministic Booking Agent
3. Should show: "New Patient" / "Existing Patient" buttons
4. Click "New Patient"
5. Should ask for name
6. Continue through all states

### **Test Clinical Q&A:**
1. Send: "I have back pain"
2. Should route to Clinical Q&A Agent
3. Should get LLM response about back pain

### **Test Insurance:**
1. Send: "What insurance do you accept?"
2. Should route to Insurance/Billing Agent
3. Should get LLM response about insurance

## **Step 6: Deploy and Monitor**

1. **Deploy the updated workflow**
2. **Test with real users**
3. **Monitor response times**
4. **Track completion rates**
5. **Iterate based on feedback**

This implementation will give you a rock-solid, fast booking flow with intelligent Q&A where it adds value! 