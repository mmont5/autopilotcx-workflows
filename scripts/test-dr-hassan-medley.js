#!/usr/bin/env node

/**
 * Dr. Hassan MedleyAgent Test Script
 * Tests the new LLM-first MedleyAgent workflow
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  webhookUrl: 'http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31',
  demoId: '550e8400-e29b-41d4-a716-446655440000',
  testCases: [
    {
      name: 'General Greeting',
      message: 'Hello',
      expectedIntent: 'general',
      expectedAgent: 'MedleyAgent'
    },
    {
      name: 'Back Pain Symptom',
      message: 'I have severe back pain',
      expectedIntent: 'clinical',
      expectedAgent: 'MedleyAgent'
    },
    {
      name: 'Appointment Request',
      message: 'I need to book an appointment',
      expectedIntent: 'appointment',
      expectedAgent: 'MedleyAgent'
    },
    {
      name: 'Insurance Question',
      message: 'Do you accept Blue Cross insurance?',
      expectedIntent: 'billing',
      expectedAgent: 'MedleyAgent'
    },
    {
      name: 'Emergency Situation',
      message: 'I have chest pain and difficulty breathing',
      expectedIntent: 'escalate',
      expectedAgent: 'MedleyAgent'
    },
    {
      name: 'Location Question',
      message: 'Where are your offices located?',
      expectedIntent: 'general',
      expectedAgent: 'MedleyAgent'
    }
  ]
};

// Demo context data for Dr. Hassan
const DEMO_CONTEXT = {
  demoId: 'hassan',
  company_name: 'Hassan Spine & Sports Medicine',
  agent_name: 'Dr. Olivia Hassan',
  industry: 'healthcare',
  category: 'Pain Management',
  locations: [
    {
      name: 'Old Bridge Office',
      address1: '200 Perrine Road, Suite 220',
      city: 'Old Bridge',
      state: 'NJ',
      zip: '08857'
    },
    {
      name: 'Jersey City Office',
      address1: '709 Newark Avenue',
      city: 'Jersey City',
      state: 'NJ',
      zip: '07306'
    }
  ],
  specialists: [
    { name: 'Dr. Hassan', specialty: 'Spine Care' },
    { name: 'Dr. Olivia', specialty: 'Sports Medicine' }
  ],
  contact: {
    phone: '(732) 759-8110',
    email: 'info@hassanspine.com'
  },
  company_description: 'Specializing in spine care and sports medicine',
  company_website: 'https://hassanspine.com'
};

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

async function testWorkflow(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  console.log(`🎯 Expected Intent: ${testCase.expectedIntent}`);
  console.log(`🤖 Expected Agent: ${testCase.expectedAgent}`);

  const requestData = {
    demoId: TEST_CONFIG.demoId,
    message: testCase.message,
    userContext: {
      previousMessages: [],
      conversationStage: 'natural_conversation'
    },
    ...DEMO_CONTEXT
  };

  try {
    const response = await makeRequest(TEST_CONFIG.webhookUrl, requestData);
    
    console.log(`📊 Status: ${response.status}`);
    
    if (response.status === 200) {
      const data = response.data;
      console.log(`✅ Response received:`);
      console.log(`   Message: ${data.message?.substring(0, 100)}...`);
      console.log(`   Intent: ${data.intent}`);
      console.log(`   Agent: ${data.agent}`);
      console.log(`   DemoId: ${data.demoId}`);
      console.log(`   Company: ${data.company_name}`);
      console.log(`   LLM Used: ${data.llm_used}`);
      
      // Validate results
      const intentMatch = data.intent === testCase.expectedIntent;
      const agentMatch = data.agent === testCase.expectedAgent;
      const contextPreserved = data.company_name === DEMO_CONTEXT.company_name;
      const hasResponse = data.message && data.message.length > 0;
      const llmUsed = data.llm_used === true;
      
      console.log(`\n📋 Results:`);
      console.log(`   Intent Match: ${intentMatch ? '✅' : '❌'}`);
      console.log(`   Agent Match: ${agentMatch ? '✅' : '❌'}`);
      console.log(`   Context Preserved: ${contextPreserved ? '✅' : '❌'}`);
      console.log(`   Has Response: ${hasResponse ? '✅' : '❌'}`);
      console.log(`   LLM Used: ${llmUsed ? '✅' : '❌'}`);
      
      return {
        success: intentMatch && agentMatch && contextPreserved && hasResponse,
        intentMatch,
        agentMatch,
        contextPreserved,
        hasResponse,
        llmUsed,
        response: data
      };
    } else {
      console.log(`❌ Error: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Dr. Hassan MedleyAgent Tests');
  console.log('========================================');
  console.log(`📡 Webhook URL: ${TEST_CONFIG.webhookUrl}`);
  console.log(`🏥 Demo ID: ${TEST_CONFIG.demoId}`);
  console.log(`🏢 Company: ${DEMO_CONTEXT.company_name}`);
  console.log(`🤖 Agent: ${DEMO_CONTEXT.agent_name}`);
  
  const results = [];
  
  for (const testCase of TEST_CONFIG.testCases) {
    const result = await testWorkflow(testCase);
    results.push({
      testCase: testCase.name,
      ...result
    });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('===============');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.testCase}`);
  });
  
  // Detailed analysis
  console.log('\n🔍 Detailed Analysis');
  console.log('===================');
  
  const intentMatches = results.filter(r => r.intentMatch).length;
  const agentMatches = results.filter(r => r.agentMatch).length;
  const contextPreserved = results.filter(r => r.contextPreserved).length;
  const hasResponses = results.filter(r => r.hasResponse).length;
  const llmUsed = results.filter(r => r.llmUsed).length;
  
  console.log(`Intent Detection: ${intentMatches}/${total} (${Math.round(intentMatches/total*100)}%)`);
  console.log(`Agent Routing: ${agentMatches}/${total} (${Math.round(agentMatches/total*100)}%)`);
  console.log(`Context Preservation: ${contextPreserved}/${total} (${Math.round(contextPreserved/total*100)}%)`);
  console.log(`Response Generation: ${hasResponses}/${total} (${Math.round(hasResponses/total*100)}%)`);
  console.log(`LLM Usage: ${llmUsed}/${total} (${Math.round(llmUsed/total*100)}%)`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Dr. Hassan MedleyAgent is working flawlessly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the workflow configuration and MedleyAgent implementation.');
  }
}

// Run the tests
runAllTests().catch(console.error); 