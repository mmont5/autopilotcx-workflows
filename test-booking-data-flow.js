const axios = require('axios');

async function testBookingDataFlow() {
    console.log('🧪 TESTING BOOKING DATA FLOW\n');
    console.log('=' .repeat(50));

    try {
        // Simulate the booking flow step by step
        let currentBookingData = {};
        let currentBookingState = 'initial';

        // Step 1: Initial request
        console.log('\n1. Testing initial request...');
        const response1 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'I want to book an appointment',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'book_appointment'
        });
        
        console.log('✅ Response:', response1.data.agent_response);
        console.log('📊 State:', response1.data.bookingState);
        console.log('📊 Booking Data:', response1.data.bookingData);
        
        // Update our tracking
        currentBookingState = response1.data.bookingState;
        if (response1.data.bookingData) {
            try {
                currentBookingData = typeof response1.data.bookingData === 'string' 
                    ? JSON.parse(response1.data.bookingData) 
                    : response1.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 2: New patient selection
        console.log('\n2. Testing new patient selection...');
        const response2 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'new patient',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'new_patient'
        });
        
        console.log('✅ Response:', response2.data.agent_response);
        console.log('📊 State:', response2.data.bookingState);
        console.log('📊 Booking Data:', response2.data.bookingData);
        
        // Update our tracking
        currentBookingState = response2.data.bookingState;
        if (response2.data.bookingData) {
            try {
                currentBookingData = typeof response2.data.bookingData === 'string' 
                    ? JSON.parse(response2.data.bookingData) 
                    : response2.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 3: Name collection
        console.log('\n3. Testing name collection...');
        const response3 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'John Doe',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'name_provided'
        });
        
        console.log('✅ Response:', response3.data.agent_response);
        console.log('📊 State:', response3.data.bookingState);
        console.log('📊 Booking Data:', response3.data.bookingData);
        
        // Update our tracking
        currentBookingState = response3.data.bookingState;
        if (response3.data.bookingData) {
            try {
                currentBookingData = typeof response3.data.bookingData === 'string' 
                    ? JSON.parse(response3.data.bookingData) 
                    : response3.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 4: DOB collection
        console.log('\n4. Testing DOB collection...');
        const response4 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: '01/15/1990',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'dob_provided'
        });
        
        console.log('✅ Response:', response4.data.agent_response);
        console.log('📊 State:', response4.data.bookingState);
        console.log('📊 Booking Data:', response4.data.bookingData);
        
        // Update our tracking
        currentBookingState = response4.data.bookingState;
        if (response4.data.bookingData) {
            try {
                currentBookingData = typeof response4.data.bookingData === 'string' 
                    ? JSON.parse(response4.data.bookingData) 
                    : response4.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 5: Phone collection
        console.log('\n5. Testing phone collection...');
        const response5 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: '+14071234567',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'phone_provided'
        });
        
        console.log('✅ Response:', response5.data.agent_response);
        console.log('📊 State:', response5.data.bookingState);
        console.log('📊 Booking Data:', response5.data.bookingData);
        
        // Update our tracking
        currentBookingState = response5.data.bookingState;
        if (response5.data.bookingData) {
            try {
                currentBookingData = typeof response5.data.bookingData === 'string' 
                    ? JSON.parse(response5.data.bookingData) 
                    : response5.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 6: Email collection
        console.log('\n6. Testing email collection...');
        const response6 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'john.doe@email.com',
            bookingState: currentBookingState,
            bookingData: currentBookingData,
            action: 'email_provided'
        });
        
        console.log('✅ Response:', response6.data.agent_response);
        console.log('📊 State:', response6.data.bookingState);
        console.log('📊 Booking Data:', response6.data.bookingData);
        
        // Update our tracking
        currentBookingState = response6.data.bookingState;
        if (response6.data.bookingData) {
            try {
                currentBookingData = typeof response6.data.bookingData === 'string' 
                    ? JSON.parse(response6.data.bookingData) 
                    : response6.data.bookingData;
            } catch (e) {
                console.log('❌ Error parsing booking data:', e);
            }
        }

        // Step 7: Test summary generation
        console.log('\n7. Testing summary generation...');
        const response7 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'test summary',
            bookingState: 'collecting_additional_info',
            bookingData: currentBookingData,
            action: 'test_summary'
        });
        
        console.log('✅ Response:', response7.data.agent_response);
        console.log('📊 State:', response7.data.bookingState);
        console.log('📊 Booking Data:', response7.data.bookingData);

        // Final analysis
        console.log('\n' + '=' .repeat(50));
        console.log('📊 FINAL ANALYSIS:');
        console.log('Current Booking Data Keys:', Object.keys(currentBookingData));
        console.log('Current Booking Data Values:', Object.values(currentBookingData));
        console.log('Current Booking State:', currentBookingState);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testBookingDataFlow(); 