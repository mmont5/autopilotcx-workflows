#!/usr/bin/env node

/**
 * Direct MedleyAgent Test
 * Tests the MedleyAgent node directly to verify LLM-first functionality
 */

const axios = require('axios');

// Test the MedleyAgent logic directly
async function testMedleyAgentDirect() {
  console.log('🧪 Testing MedleyAgent Direct Logic');
  console.log('====================================');

  const testCases = [
    {
      name: 'Back Pain Symptom',
      message: 'I have severe back pain',
      expectedIntent: 'clinical'
    },
    {
      name: 'Appointment Request',
      message: 'I need to book an appointment',
      expectedIntent: 'appointment'
    },
    {
      name: 'Insurance Question',
      message: 'Do you accept Blue Cross insurance?',
      expectedIntent: 'billing'
    },
    {
      name: 'Emergency Situation',
      message: 'I have chest pain and difficulty breathing',
      expectedIntent: 'escalate'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📝 Message: "${testCase.message}"`);
    
    try {
      // Test the LLM server directly
      const llmResponse = await axios.post(
        'http://localhost:8300/api/v1/llm/generate/completion',
        {
          prompt: `A patient says: "${testCase.message}"
You are a compassionate, professional healthcare assistant specializing in Pain Management and Sports Medicine.
Respond with empathy, kindness, and specific reference to the patient's concern. Offer support and next steps.`,
          max_tokens: 120,
          temperature: 0.7
        },
        { timeout: 5000 }
      );

      if (llmResponse.data && llmResponse.data.text) {
        console.log(`✅ LLM Response: ${llmResponse.data.text.trim()}`);
      } else {
        console.log(`❌ No LLM response`);
      }
    } catch (error) {
      console.log(`❌ LLM Error: ${error.message}`);
    }

    // Test intent classification
    const intent = classifyIntent(testCase.message);
    const intentMatch = intent === testCase.expectedIntent;
    
    console.log(`🎯 Intent: ${intent} (Expected: ${testCase.expectedIntent})`);
    console.log(`📊 Intent Match: ${intentMatch ? '✅' : '❌'}`);
  }
}

// Intent classification logic (same as in workflow)
function classifyIntent(input) {
  const message = input.toLowerCase();
  
  if (
    message.includes('emergency') ||
    message.includes('911') ||
    message.includes('severe pain') ||
    message.includes('numbness') ||
    message.includes("can't move") ||
    message.includes("can't feel")
  ) {
    return 'escalate';
  }
  if (
    message.includes('pain') ||
    message.includes('hurt') ||
    message.includes('ache') ||
    message.includes('back') ||
    message.includes('neck') ||
    message.includes('shoulder') ||
    message.includes('spine') ||
    message.includes('injury') ||
    message.includes('symptom') ||
    message.includes('discomfort')
  ) {
    return 'clinical';
  }
  if (
    message.includes('book') ||
    message.includes('appointment') ||
    message.includes('schedule') ||
    message.includes('new patient')
  ) {
    return 'appointment';
  }
  if (
    message.includes('cost') ||
    message.includes('price') ||
    message.includes('bill') ||
    message.includes('insurance') ||
    message.includes('coverage')
  ) {
    return 'billing';
  }
  return 'general';
}

// Test the LLM server health
async function testLLMHealth() {
  console.log('\n🔍 Testing LLM Server Health');
  console.log('============================');
  
  try {
    const response = await axios.get('http://localhost:8300/health', { timeout: 3000 });
    console.log(`✅ LLM Server: ${response.status} - ${response.statusText}`);
    return true;
  } catch (error) {
    console.log(`❌ LLM Server Error: ${error.message}`);
    return false;
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Direct MedleyAgent Tests');
  console.log('====================================');
  
  // Test LLM server health first
  const llmHealthy = await testLLMHealth();
  
  if (llmHealthy) {
    await testMedleyAgentDirect();
  } else {
    console.log('\n⚠️  LLM server not available. Starting workflow-based tests...');
    // Fallback to workflow tests
    require('./test-dr-hassan-medley.js');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testMedleyAgentDirect, testLLMHealth, classifyIntent }; 