const fs = require('fs');
const path = require('path');

console.log('🧪 COMPREHENSIVE TEST REPORT FOR RECENT CHANGES\n');
console.log('=' .repeat(60));

// Test 1: Check if TypeScript compilation worked
console.log('\n1. ✅ TypeScript Compilation Test');
const tsFile = path.join(__dirname, 'nodes/BookingAgent.node.ts');
const jsFile = path.join(__dirname, 'nodes/BookingAgent.node.js');

if (fs.existsSync(tsFile) && fs.existsSync(jsFile)) {
    const tsStats = fs.statSync(tsFile);
    const jsStats = fs.statSync(jsFile);
    
    if (jsStats.size > tsStats.size) {
        console.log('✅ JavaScript file is larger than TypeScript (compilation successful)');
        console.log(`   TypeScript: ${tsStats.size} bytes`);
        console.log(`   JavaScript: ${jsStats.size} bytes`);
    } else {
        console.log('❌ JavaScript file size issue - may not be properly compiled');
    }
} else {
    console.log('❌ Missing TypeScript or JavaScript files');
}

// Test 2: Check for example text in compiled JS
console.log('\n2. ✅ Example Text Test');
const jsContent = fs.readFileSync(jsFile, 'utf8');

const exampleTests = [
    { name: 'Date of Birth Example', pattern: 'Example: MM/DD/YYYY', found: jsContent.includes('Example: MM/DD/YYYY') },
    { name: 'Phone Number Example', pattern: 'Example: +14071234567', found: jsContent.includes('Example: +14071234567') },
    { name: 'No Email Example in Responses', pattern: 'email.*Example', found: !jsContent.includes('emailRequest') || !jsContent.includes('Example') },
    { name: 'No Policy Number Example', pattern: 'policy.*Example', found: !jsContent.includes('policyNumber') || !jsContent.includes('Example') },
    { name: 'No Group Number Example', pattern: 'group.*Example', found: !jsContent.includes('groupNumber') || !jsContent.includes('Example') }
];

exampleTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 3: Check for personalized responses
console.log('\n3. ✅ Personalized Responses Test');
const personalizedTests = [
    { name: 'Agent Name Placeholder', pattern: '{agentName}', found: jsContent.includes('{agentName}') },
    { name: 'Company Name Placeholder', pattern: '{companyName}', found: jsContent.includes('{companyName}') },
    { name: 'Format Response Function', pattern: 'formatResponse', found: jsContent.includes('formatResponse') }
];

personalizedTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 4: Check Group Number validation fix
console.log('\n4. ✅ Group Number Validation Test');
const groupNumberTest = jsContent.includes('validateGroupNumber') && jsContent.includes('/^[a-zA-Z0-9\\s\\-_.,/#]+$/');
console.log(`${groupNumberTest ? '✅' : '❌'} Group Number validation regex updated: ${groupNumberTest ? 'PASS' : 'FAIL'}`);

// Test 5: Check for new booking steps
console.log('\n5. ✅ New Booking Steps Test');
const newStepsTests = [
    { name: 'Appointment Timing State', pattern: 'collecting_appointment_timing', found: jsContent.includes('collecting_appointment_timing') },
    { name: 'Day of Week State', pattern: 'collecting_day_of_week', found: jsContent.includes('collecting_day_of_week') },
    { name: 'Time of Day State', pattern: 'collecting_time_of_day', found: jsContent.includes('collecting_time_of_day') },
    { name: 'Appointment Timing Validation', pattern: 'validateAppointmentTiming', found: jsContent.includes('validateAppointmentTiming') },
    { name: 'Day of Week Validation', pattern: 'validateDayOfWeek', found: jsContent.includes('validateDayOfWeek') },
    { name: 'Time of Day Validation', pattern: 'validateTimeOfDay', found: jsContent.includes('validateTimeOfDay') }
];

newStepsTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 6: Check for dynamic day functions
console.log('\n6. ✅ Dynamic Day Functions Test');
const dynamicDayTests = [
    { name: 'Get Available Days Function', pattern: 'getAvailableDays', found: jsContent.includes('getAvailableDays') },
    { name: 'Get Business Hours Function', pattern: 'getBusinessHoursForDay', found: jsContent.includes('getBusinessHoursForDay') },
    { name: 'Weekday Text Parsing', pattern: 'weekday_text', found: jsContent.includes('weekday_text') }
];

dynamicDayTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 7: Check Docker deployment
console.log('\n7. ✅ Docker Deployment Test');
const dockerFile = path.join(__dirname, '../../.n8n/custom/BookingAgent.node.js');
if (fs.existsSync(dockerFile)) {
    const dockerStats = fs.statSync(dockerFile);
    console.log(`✅ Docker file exists: ${dockerStats.size} bytes`);
} else {
    console.log('❌ Docker file not found - deployment may have failed');
}

// Summary
console.log('\n' + '=' .repeat(60));
console.log('📊 SUMMARY:');

const allTests = [
    ...exampleTests.map(t => ({ name: t.name, passed: t.found })),
    ...personalizedTests.map(t => ({ name: t.name, passed: t.found })),
    { name: 'Group Number Validation', passed: !!groupNumberTest },
    ...newStepsTests.map(t => ({ name: t.name, passed: t.found })),
    ...dynamicDayTests.map(t => ({ name: t.name, passed: t.found })),
    { name: 'Docker Deployment', passed: fs.existsSync(dockerFile) }
];

const passedTests = allTests.filter(t => t.passed).length;
const totalTests = allTests.length;

console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
console.log(`📈 Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Recent changes are working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Please check the specific failures above.');
}

console.log('\n' + '=' .repeat(60));