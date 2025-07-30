#!/usr/bin/env node

/**
 * Dr. Hassan Workflow Test Script
 * Tests the corrected workflow with various scenarios
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  webhookUrl: 'http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31',
  demoId: 'hassan',
  testCases: [
    {
      name: 'General Greeting',
      message: 'Hello',
      expectedIntent: 'general',
      expectedAgent: 'Virtuoso'
    },
    {
      name: 'Appointment Booking',
      message: 'I want to book an appointment',
      expectedIntent: 'appointment',
      expectedAgent: 'Booking'
    },
    {
      name: 'Clinical Symptoms',
      message: 'I have back pain',
      expectedIntent: 'clinical',
      expectedAgent: 'Medley'
    },
    {
      name: 'Emergency',
      message: 'I have severe chest pain',
      expectedIntent: 'escalate',
      expectedAgent: 'Human'
    },
    {
      name: 'Billing Question',
      message: 'Do you accept Blue Cross insurance?',
      expectedIntent: 'billing',
      expectedAgent: 'Score'
    },
    {
      name: 'Feedback',
      message: 'I have a complaint',
      expectedIntent: 'feedback',
      expectedAgent: 'Harmony'
    }
  ]
};

// Demo context data (simulating what would come from Supabase)
const DEMO_CONTEXT = {
  demoId: 'hassan',
  company_name: 'Hassan Spine & Sports Medicine',
  agent_name: 'Olivia',
  industry: 'healthcare',
  category: 'pain_management',
  locations: [
    {
      address1: '200 Perrine Road, Suite 220',
      city: 'Old Bridge',
      state: 'NJ',
      zip: '08857'
    },
    {
      address1: '709 Newark Avenue',
      city: 'Jersey City',
      state: 'NJ',
      zip: '07306'
    }
  ],
  specialists: [
    { name: 'Dr. Hassan', specialty: 'Spine Care' }
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
      
      // Validate results
      const intentMatch = data.intent === testCase.expectedIntent;
      const agentMatch = data.agent === testCase.expectedAgent;
      const contextPreserved = data.company_name === DEMO_CONTEXT.company_name;
      
      console.log(`\n📋 Results:`);
      console.log(`   Intent Match: ${intentMatch ? '✅' : '❌'}`);
      console.log(`   Agent Match: ${agentMatch ? '✅' : '❌'}`);
      console.log(`   Context Preserved: ${contextPreserved ? '✅' : '❌'}`);
      
      return {
        success: intentMatch && agentMatch && contextPreserved,
        intentMatch,
        agentMatch,
        contextPreserved,
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
  console.log('🚀 Starting Dr. Hassan Workflow Tests');
  console.log('=====================================');
  console.log(`📡 Webhook URL: ${TEST_CONFIG.webhookUrl}`);
  console.log(`🏥 Demo ID: ${TEST_CONFIG.demoId}`);
  console.log(`🏢 Company: ${DEMO_CONTEXT.company_name}`);
  
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
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! The workflow is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the workflow configuration.');
  }
  
  return results;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testWorkflow }; 