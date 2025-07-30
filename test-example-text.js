const axios = require('axios');

async function testExampleText() {
    console.log('🧪 Testing Example Text and Personalized Responses...\n');

    try {
        // Test 1: Initial welcome message with personalized responses
        console.log('1. Testing initial welcome message...');
        const response1 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'I want to book an appointment',
            bookingState: 'initial',
            bookingData: {},
            action: 'book_appointment'
        });
        
        console.log('✅ Response:', response1.data.response);
        console.log('📊 State:', response1.data.bookingState);
        console.log('🔘 Actions:', response1.data.actions?.length || 0);
        console.log('');

        // Test 2: DOB request with example text
        console.log('2. Testing DOB request with example text...');
        const response2 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'new patient',
            bookingState: 'patient_type_selected',
            bookingData: { patientType: 'new' },
            action: 'new_patient'
        });
        
        console.log('✅ Response:', response2.data.response);
        console.log('📊 State:', response2.data.bookingState);
        console.log('');

        // Test 3: Phone request with example text
        console.log('3. Testing phone request with example text...');
        const response3 = await axios.post('http://localhost:5678/webhook/dr-hassan-chat', {
            message: 'John Doe',
            bookingState: 'collecting_name',
            bookingData: { firstName: 'John', lastName: 'Doe' },
            action: 'name_provided'
        });
        
        console.log('✅ Response:', response3.data.response);
        console.log('📊 State:', response3.data.bookingState);
        console.log('');

        // Test 4: Check if example text appears
        console.log('4. Checking for example text...');
        const dobResponse = response3.data.response;
        const phoneResponse = response2.data.response;
        
        if (dobResponse.includes('(Example: MM/DD/YYYY)')) {
            console.log('✅ DOB example text found');
        } else {
            console.log('❌ DOB example text missing');
        }
        
        if (phoneResponse.includes('(Example: +14071234567)')) {
            console.log('✅ Phone example text found');
        } else {
            console.log('❌ Phone example text missing');
        }

        // Test 5: Check for personalized responses
        if (response1.data.response.includes('{agentName}') || response1.data.response.includes('{companyName}')) {
            console.log('❌ Personalized placeholders not replaced');
        } else if (response1.data.response.includes('Hassan') || response1.data.response.includes('Spine')) {
            console.log('✅ Personalized responses working');
        } else {
            console.log('❓ Personalized responses unclear');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testExampleText();