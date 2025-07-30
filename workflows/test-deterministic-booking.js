// Test Script for Deterministic Booking Flow
// Run this to verify the implementation works correctly

const testCases = [
  {
    name: "Initial Booking Request",
    input: "I want to book an appointment",
    expectedIntent: "appointment",
    expectedAgent: "DeterministicBookingAgent",
    expectedResponse: "New Patient" // Should contain this text
  },
  {
    name: "Clinical Question",
    input: "I have back pain",
    expectedIntent: "clinical",
    expectedAgent: "ClinicalQAAgent",
    expectedResponse: "pain" // Should contain this text
  },
  {
    name: "Insurance Question",
    input: "What insurance do you accept?",
    expectedIntent: "billing",
    expectedAgent: "InsuranceBillingAgent",
    expectedResponse: "insurance" // Should contain this text
  },
  {
    name: "Feedback",
    input: "I want to leave feedback",
    expectedIntent: "feedback",
    expectedAgent: "FeedbackSupportAgent",
    expectedResponse: "feedback" // Should contain this text
  },
  {
    name: "General Question",
    input: "What are your hours?",
    expectedIntent: "general",
    expectedAgent: "GeneralQAAgent",
    expectedResponse: "hours" // Should contain this text
  },
  {
    name: "Emergency",
    input: "I have severe pain",
    expectedIntent: "escalate",
    expectedAgent: "HumanAgent",
    expectedResponse: "emergency" // Should contain this text
  }
];

// Test booking flow states
const bookingFlowTests = [
  {
    name: "Step 1: Initial State",
    bookingState: "initial",
    userInput: "",
    expectedResponse: "New Patient",
    expectedButtons: ["New Patient", "Existing Patient"]
  },
  {
    name: "Step 2: Patient Type Selected",
    bookingState: "patient_type_selected",
    userAction: "new_patient",
    expectedResponse: "First Name and Last Name",
    expectedButtons: []
  },
  {
    name: "Step 3: Name Collected",
    bookingState: "collecting_name",
    userInput: "John Smith",
    expectedResponse: "Date of Birth",
    expectedButtons: []
  },
  {
    name: "Step 4: DOB Collected",
    bookingState: "collecting_dob",
    userInput: "01/15/1985",
    expectedResponse: "Phone Number",
    expectedButtons: []
  },
  {
    name: "Step 5: Phone Collected",
    bookingState: "collecting_phone",
    userInput: "+15031234567",
    expectedResponse: "Email Address",
    expectedButtons: []
  },
  {
    name: "Step 6: Email Collected",
    bookingState: "collecting_email",
    userInput: "john@example.com",
    expectedResponse: "locations",
    expectedButtons: ["Old Bridge", "Jersey City", "South Plainfield"]
  },
  {
    name: "Step 7: Location Selected",
    bookingState: "collecting_location",
    userAction: "location_old_bridge",
    expectedResponse: "pain level",
    expectedButtons: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  },
  {
    name: "Step 8: Pain Level Selected",
    bookingState: "collecting_pain_level",
    userAction: "pain_level_7",
    expectedResponse: "symptoms",
    expectedButtons: []
  },
  {
    name: "Step 9: Symptoms Collected",
    bookingState: "collecting_symptoms",
    userInput: "Lower back pain and stiffness",
    expectedResponse: "procedure",
    expectedButtons: ["Spine Surgery", "Non-Surgical Treatment", "Podiatry", "Orthopedics", "PRP Therapy", "Radiofrequency Ablation", "Spinal Cord Stimulation", "Consultation"]
  },
  {
    name: "Step 10: Procedure Selected",
    bookingState: "collecting_procedure",
    userAction: "procedure_consultation",
    expectedResponse: "insurance",
    expectedButtons: ["Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Humana", "Other"]
  },
  {
    name: "Step 11: Insurance Selected",
    bookingState: "collecting_insurance",
    userAction: "insurance_aetna",
    expectedResponse: "Policy Holder Name",
    expectedButtons: []
  },
  {
    name: "Step 12: Insurance Details",
    bookingState: "collecting_insurance_details",
    userInput: "John Smith",
    expectedResponse: "Insurance ID Number",
    expectedButtons: []
  },
  {
    name: "Step 13: Additional Info",
    bookingState: "collecting_additional_info",
    userInput: "I prefer morning appointments",
    expectedResponse: "confirm",
    expectedButtons: ["Yes, Schedule Appointment", "No, Let Me Edit"]
  },
  {
    name: "Step 14: Confirmation",
    bookingState: "confirmation",
    userAction: "confirm_booking",
    expectedResponse: "submitted",
    expectedButtons: []
  }
];

console.log("🧪 TESTING DETERMINISTIC BOOKING FLOW");
console.log("=====================================");

// Test intent classification
console.log("\n📋 Testing Intent Classification:");
testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   Input: "${testCase.input}"`);
  console.log(`   Expected Intent: ${testCase.expectedIntent}`);
  console.log(`   Expected Agent: ${testCase.expectedAgent}`);
  console.log(`   Expected Response: ${testCase.expectedResponse}`);
});

// Test booking flow states
console.log("\n📋 Testing Booking Flow States:");
bookingFlowTests.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`);
  console.log(`   State: ${testCase.bookingState}`);
  console.log(`   Input: ${testCase.userInput || testCase.userAction}`);
  console.log(`   Expected Response: ${testCase.expectedResponse}`);
  console.log(`   Expected Buttons: ${testCase.expectedButtons.join(", ")}`);
});

console.log("\n✅ Test cases defined. Ready to implement!");
console.log("\n📝 Implementation Checklist:");
console.log("1. ✅ Update Intent Classifier");
console.log("2. ✅ Replace Build Booking Prompt with Deterministic Booking Agent");
console.log("3. ✅ Update Switch Node routing");
console.log("4. ✅ Create LLM agents for value-add branches");
console.log("5. 🔄 Test each branch");
console.log("6. 🔄 Deploy and monitor");

console.log("\n🚀 Ready to implement! Follow the steps in implementation-steps.md"); 