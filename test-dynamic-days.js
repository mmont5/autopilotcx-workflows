const axios = require('axios');

async function testDynamicDays() {
  const webhookUrl = 'http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31';
  
  console.log('🧪 Testing Dynamic Day Selection...\n');

  // Test appointment timing selection
  console.log('1. Testing appointment timing selection...');
  try {
    const response1 = await axios.post(webhookUrl, {
      message: "next week",
      userAction: "timing_next_week",
      action: "timing_next_week",
      body: {
        message: "next week",
        userAction: "timing_next_week",
        action: "timing_next_week"
      },
      bookingState: "collecting_appointment_timing",
      bookingData: '{"firstName":"John","lastName":"Doe","dateOfBirth":"01/15/1985","phone":"555-123-4567","email":"john.doe@example.com"}'
    });
    console.log('✅ Appointment timing response:', response1.data.agent_response);
    console.log('📊 Booking state:', response1.data.bookingState);
    console.log('🔘 Suggested actions:', response1.data.suggestedActions?.length || 0);
    
    if (response1.data.suggestedActions) {
      console.log('📅 Available days:');
      response1.data.suggestedActions.forEach((action, index) => {
        console.log(`   ${index + 1}. ${action.text}`);
      });
    }
  } catch (error) {
    console.log('❌ Error in appointment timing request:', error.message);
  }

  console.log('\n🧪 Dynamic day test completed!');
}

testDynamicDays().catch(console.error); 