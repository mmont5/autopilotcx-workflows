// Test script to trace data flow through workflow nodes
const testData = {
  message: "I want to book an appointment",
  demoId: "bd5aa8b2-84fa-4b64-986d-7458b680b5b9",
  config: {
    branding: {
      companyName: "Hassan Spine & Sports Medicine",
      agentName: "Olivia"
    }
  },
  bookingState: "collecting_additional_info",
  bookingData: {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    phone: "555-123-4567",
    email: "john.doe@example.com",
    location: "South Plainfield",
    painLevel: "7",
    symptoms: "back pain",
    procedure: "Physical Therapy",
    insurance: "Blue Cross Blue Shield",
    policyHolder: "John Doe",
    policyNumber: "123456789",
    groupNumber: "ABC123",
    additionalInfo: "No additional info"
  },
  company_name: "Hassan Spine & Sports Medicine",
  agent_name: "Olivia",
  industry: "healthcare",
  services: [
    "Spine Surgery", "Non-Surgical", "Podiatry", "Orthopedics", "Spinal Conditions", "Knee Injury",
    "Shoulder Injury", "Arthritis", "Joint Pain", "PRP Therapy", "Radiofrequency Ablation",
    "Spinal Cord Stimulation", "Pain Relief", "Sports Injury", "Sports Medicine"
  ],
  insurance_providers: [
    "Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealth", "Humana", "Kaiser Permanente",
    "Anthem", "Molina Healthcare"
  ],
  locations: [
    { name: "Old Bridge", address1: "200 Perrine Road, Suite 220", city: "Old Bridge", state: "NJ", zip: "08857" },
    { name: "Jersey City", address1: "123 Main Street", city: "Jersey City", state: "NJ", zip: "07302" },
    { name: "South Plainfield", address1: "456 Oak Avenue", city: "South Plainfield", state: "NJ", zip: "07080" }
  ]
};

console.log("=== WORKFLOW DATA FLOW TEST ===");
console.log("Input data:", JSON.stringify(testData, null, 2));

// Simulate Initial Processing node
console.log("\n=== INITIAL PROCESSING NODE ===");
const initialProcessingOutput = {
  ...testData,
  bookingData: testData.bookingData,
  bookingState: testData.bookingState,
  message: testData.message,
  action: testData.action
};
console.log("Initial Processing output:", JSON.stringify(initialProcessingOutput, null, 2));

// Simulate MaestroAgent node
console.log("\n=== MAESTROAGENT NODE ===");
const maestroAgentOutput = {
  ...initialProcessingOutput,
  original_context: {
    demoData: initialProcessingOutput,
    webhookData: {
      message: initialProcessingOutput.message,
      bookingState: initialProcessingOutput.bookingState,
      bookingData: initialProcessingOutput.bookingData,
      userAction: initialProcessingOutput.action || "",
      timestamp: new Date().toISOString()
    },
    fullContext: {}
  }
};
console.log("MaestroAgent output:", JSON.stringify(maestroAgentOutput, null, 2));

// Simulate BookingAgent data extraction
console.log("\n=== BOOKINGAGENT DATA EXTRACTION ===");
const data = maestroAgentOutput;
const webhookData = maestroAgentOutput.original_context?.webhookData || {};
const originalContext = maestroAgentOutput.original_context;

console.log("Data received by BookingAgent:", JSON.stringify(data, null, 2));
console.log("WebhookData:", JSON.stringify(webhookData, null, 2));
console.log("OriginalContext:", JSON.stringify(originalContext, null, 2));

// Extract booking data as BookingAgent does
let currentBookingState = data.bookingState || webhookData.bookingState || originalContext?.webhookData?.bookingState || "initial";
const bookingDataSource = data.bookingData || webhookData.bookingData || originalContext?.webhookData?.bookingData || "{}";

console.log("\nExtracted booking state:", currentBookingState);
console.log("Extracted booking data source:", bookingDataSource);
console.log("Booking data source type:", typeof bookingDataSource);

let currentBookingData = {};
try {
  if (typeof bookingDataSource === 'string') {
    currentBookingData = JSON.parse(bookingDataSource);
  } else if (typeof bookingDataSource === 'object' && bookingDataSource !== null) {
    currentBookingData = bookingDataSource;
  } else {
    currentBookingData = {};
  }
} catch (error) {
  console.log("Error parsing booking data:", error);
  currentBookingData = {};
}

console.log("Final extracted booking data:", currentBookingData);
console.log("Booking data keys:", Object.keys(currentBookingData));
console.log("Booking data values:", Object.values(currentBookingData));

// Test the actual N8N webhook
console.log("\n=== TESTING ACTUAL N8N WEBHOOK ===");

async function testN8NWebhook() {
  try {
    const response = await fetch('http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log("N8N Response:", JSON.stringify(data, null, 2));
    
    // Check if booking data is preserved
    if (data.bookingData) {
      console.log("Booking data in response:", data.bookingData);
      try {
        const parsedBookingData = typeof data.bookingData === 'string' 
          ? JSON.parse(data.bookingData) 
          : data.bookingData;
        console.log("Parsed booking data:", parsedBookingData);
        console.log("Booking data keys:", Object.keys(parsedBookingData));
      } catch (error) {
        console.log("Error parsing booking data from response:", error);
      }
    } else {
      console.log("No booking data in response");
    }
  } catch (error) {
    console.error("Error testing N8N webhook:", error);
  }
}

testN8NWebhook(); 