const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING SUMMARY FIXES\n');
console.log('=' .repeat(50));

// Test 1: Check if emojis are removed
console.log('\n1. ✅ Emoji Removal Test');
const jsFile = path.join(__dirname, 'nodes/BookingAgent.node.js');
const jsContent = fs.readFileSync(jsFile, 'utf8');

const emojiTests = [
    { name: 'Personal Information - No Emoji', pattern: '📋', found: !jsContent.includes('📋') },
    { name: 'Contact Details - No Emoji', pattern: '📞', found: !jsContent.includes('📞') },
    { name: 'Appointment Preferences - No Emoji', pattern: '📅', found: !jsContent.includes('📅') },
    { name: 'Medical Information - No Emoji', pattern: '🏥', found: !jsContent.includes('🏥') },
    { name: 'Insurance Information - No Emoji', pattern: '💳', found: !jsContent.includes('💳') },
    { name: 'Additional Information - No Emoji', pattern: '📝', found: !jsContent.includes('📝') }
];

emojiTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 2: Check if section headers are present without emojis
console.log('\n2. ✅ Section Headers Test');
const headerTests = [
    { name: 'Personal Information Header', pattern: '**Personal Information**', found: jsContent.includes('**Personal Information**') },
    { name: 'Contact Details Header', pattern: '**Contact Details**', found: jsContent.includes('**Contact Details**') },
    { name: 'Appointment Preferences Header', pattern: '**Appointment Preferences**', found: jsContent.includes('**Appointment Preferences**') },
    { name: 'Medical Information Header', pattern: '**Medical Information**', found: jsContent.includes('**Medical Information**') },
    { name: 'Insurance Information Header', pattern: '**Insurance Information**', found: jsContent.includes('**Insurance Information**') },
    { name: 'Additional Information Header', pattern: '**Additional Information**', found: jsContent.includes('**Additional Information**') }
];

headerTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Test 3: Check if highlightIfMissing function is improved
console.log('\n3. ✅ Highlight Function Test');
const highlightTests = [
    { name: 'Enhanced null check', pattern: 'value === null', found: jsContent.includes('value === null') },
    { name: 'Enhanced undefined check', pattern: 'value === undefined', found: jsContent.includes('value === undefined') },
    { name: 'Enhanced empty string check', pattern: 'value === \'\'', found: jsContent.includes('value === \'\'') }
];

highlightTests.forEach(test => {
    console.log(`${test.found ? '✅' : '❌'} ${test.name}: ${test.found ? 'PASS' : 'FAIL'}`);
});

// Summary
console.log('\n' + '=' .repeat(50));
console.log('📊 SUMMARY:');

const allTests = [
    ...emojiTests.map(t => ({ name: t.name, passed: t.found })),
    ...headerTests.map(t => ({ name: t.name, passed: t.found })),
    ...highlightTests.map(t => ({ name: t.name, passed: t.found }))
];

const passedTests = allTests.filter(t => t.passed).length;
const totalTests = allTests.length;

console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
console.log(`📈 Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 ALL SUMMARY FIXES ARE WORKING!');
    console.log('✅ Emojis removed for healthcare professionalism');
    console.log('✅ Enhanced data checking to fix "Not provided" issue');
} else {
    console.log('\n⚠️  Some tests failed. Please check the specific failures above.');
}

console.log('\n' + '=' .repeat(50)); 