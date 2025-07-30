// Direct test to N8N webhook
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
  }
};

console.log("Testing direct N8N webhook...");
console.log("Test data:", JSON.stringify(testData, null, 2));

async function testN8N() {
  try {
    const response = await fetch('http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log("N8N Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("N8N Error:", error);
  }
}

testN8N(); 