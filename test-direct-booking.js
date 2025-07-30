// Direct test to BookingAgent node
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
  // Add demo data that the BookingAgent expects
  company_name: "Hassan Spine & Sports Medicine",
  agent_name: "Olivia",
  industry: "healthcare",
  services: [
    'Spine Surgery',
    'Non-Surgical',
    'Podiatry',
    'Orthopedics',
    'Spinal Conditions',
    'Knee Injury',
    'Shoulder Injury',
    'Arthritis',
    'Joint Pain',
    'PRP Therapy',
    'Radiofrequency Ablation',
    'Spinal Cord Stimulation',
    'Pain Relief',
    'Sports Injury',
    'Sports Medicine'
  ],
  insurance_providers: [
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'UnitedHealth',
    'Humana',
    'Kaiser Permanente',
    'Anthem',
    'Molina Healthcare'
  ],
  locations: [
    {
      name: "Old Bridge",
      address1: "200 Perrine Road, Suite 220",
      city: "Old Bridge",
      state: "NJ",
      zip: "08857"
    },
    {
      name: "Jersey City",
      address1: "123 Main Street",
      city: "Jersey City",
      state: "NJ",
      zip: "07302"
    },
    {
      name: "South Plainfield",
      address1: "456 Oak Avenue",
      city: "South Plainfield",
      state: "NJ",
      zip: "07080"
    }
  ]
};

console.log("Testing direct BookingAgent...");
console.log("Test data:", JSON.stringify(testData, null, 2));

async function testDirectBooking() {
  try {
    const response = await fetch('http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log("Direct BookingAgent Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Direct BookingAgent Error:", error);
  }
}

testDirectBooking(); 