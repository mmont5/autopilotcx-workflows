const axios = require('axios');

async function testDynamicDaysDirect() {
  const webhookUrl = 'http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31';
  
  console.log('🧪 Testing Dynamic Day Selection Direct...\n');

  // Test day selection directly
  console.log('1. Testing day selection directly...');
  try {
    const response1 = await axios.post(webhookUrl, {
      message: "monday",
      userAction: "day_monday",
      action: "day_monday",
      bookingState: "collecting_day_of_week",
      bookingData: '{"firstName":"John","lastName":"Doe","dateOfBirth":"01/15/1985","phone":"555-123-4567","email":"john.doe@example.com","appointmentTiming":"next week"}'
    });
    console.log('✅ Day selection response:', response1.data.agent_response);
    console.log('📊 Booking state:', response1.data.bookingState);
    console.log('🔘 Suggested actions:', response1.data.suggestedActions?.length || 0);
    
    if (response1.data.suggestedActions) {
      console.log('📅 Available days:');
      response1.data.suggestedActions.forEach((action, index) => {
        console.log(`   ${index + 1}. ${action.text}`);
      });
    }
  } catch (error) {
    console.log('❌ Error in day selection request:', error.message);
  }

  console.log('\n🧪 Dynamic day direct test completed!');
}

testDynamicDaysDirect().catch(console.error); 