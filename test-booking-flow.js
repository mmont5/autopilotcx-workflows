const axios = require('axios');

async function testBookingFlow() {
  const webhookUrl = 'http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31';
  
  console.log('🧪 Testing Booking Flow with New Timing Steps...\n');

  // Test 1: Initial booking request
  console.log('1. Testing initial booking request...');
  try {
    const response1 = await axios.post(webhookUrl, {
      message: "I want to book an appointment",
      bookingState: "initial",
      bookingData: "{}"
    });
    console.log('✅ Initial response:', response1.data.agent_response);
    console.log('📊 Booking state:', response1.data.bookingState);
    console.log('🔘 Suggested actions:', response1.data.suggestedActions?.length || 0);
  } catch (error) {
    console.log('❌ Error in initial request:', error.message);
  }

  // Test 2: New patient selection
  console.log('\n2. Testing new patient selection...');
  try {
    const response2 = await axios.post(webhookUrl, {
      message: "new patient",
      action: "new_patient",
      bookingState: "patient_type_selected",
      bookingData: "{}"
    });
    console.log('✅ New patient response:', response2.data.agent_response);
    console.log('📊 Booking state:', response2.data.bookingState);
  } catch (error) {
    console.log('❌ Error in new patient request:', error.message);
  }

  // Test 3: Name collection
  console.log('\n3. Testing name collection...');
  try {
    const response3 = await axios.post(webhookUrl, {
      message: "John Doe",
      bookingState: "collecting_name",
      bookingData: "{}"
    });
    console.log('✅ Name response:', response3.data.agent_response);
    console.log('📊 Booking state:', response3.data.bookingState);
  } catch (error) {
    console.log('❌ Error in name request:', error.message);
  }

  // Test 4: DOB collection
  console.log('\n4. Testing DOB collection...');
  try {
    const response4 = await axios.post(webhookUrl, {
      message: "01/15/1985",
      bookingState: "collecting_dob",
      bookingData: '{"firstName":"John","lastName":"Doe"}'
    });
    console.log('✅ DOB response:', response4.data.agent_response);
    console.log('📊 Booking state:', response4.data.bookingState);
  } catch (error) {
    console.log('❌ Error in DOB request:', error.message);
  }

  // Test 5: Phone collection
  console.log('\n5. Testing phone collection...');
  try {
    const response5 = await axios.post(webhookUrl, {
      message: "555-123-4567",
      bookingState: "collecting_phone",
      bookingData: '{"firstName":"John","lastName":"Doe","dateOfBirth":"01/15/1985"}'
    });
    console.log('✅ Phone response:', response5.data.agent_response);
    console.log('📊 Booking state:', response5.data.bookingState);
  } catch (error) {
    console.log('❌ Error in phone request:', error.message);
  }

  // Test 6: Email collection
  console.log('\n6. Testing email collection...');
  try {
    const response6 = await axios.post(webhookUrl, {
      message: "john.doe@example.com",
      bookingState: "collecting_email",
      bookingData: '{"firstName":"John","lastName":"Doe","dateOfBirth":"01/15/1985","phone":"555-123-4567"}'
    });
    console.log('✅ Email response:', response6.data.agent_response);
    console.log('📊 Booking state:', response6.data.bookingState);
    console.log('🔘 Suggested actions:', response6.data.suggestedActions?.length || 0);
  } catch (error) {
    console.log('❌ Error in email request:', error.message);
  }

  // Test 7: Appointment timing
  console.log('\n7. Testing appointment timing...');
  try {
    const response7 = await axios.post(webhookUrl, {
      message: "next week",
      action: "timing_next_week",
      bookingState: "collecting_appointment_timing",
      bookingData: '{"firstName":"John","lastName":"Doe","dateOfBirth":"01/15/1985","phone":"555-123-4567","email":"john.doe@example.com"}'
    });
    console.log('✅ Appointment timing response:', response7.data.agent_response);
    console.log('📊 Booking state:', response7.data.bookingState);
    console.log('🔘 Suggested actions:', response7.data.suggestedActions?.length || 0);
  } catch (error) {
    console.log('❌ Error in appointment timing request:', error.message);
  }

  console.log('\n🧪 Booking flow test completed!');
}

testBookingFlow().catch(console.error); 