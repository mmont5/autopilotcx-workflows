#!/usr/bin/env node

/**
 * Activate Dr. Hassan MedleyAgent Workflow
 * Imports and activates the workflow in N8N
 */

const fs = require('fs');
const path = require('path');

// N8N Configuration
const N8N_CONFIG = {
  baseUrl: 'http://localhost:5678',
  apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNGI2NmM1Mi1kOTNkLTRhYjItYWJlOS0yNjQ5ZmVlZGI3ZWQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ4NDY2MTgyfQ.G4lvWnzp5NCszXLRNU0KYGeGdrw_snWgDUKEJDyB_8w',
  workflowFile: path.join(__dirname, '../workflows/Hassan_Spine_and_Sports_Medicine_Demo_Workflow_July_17_2025.json')
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const https = require('https');
    
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_CONFIG.apiKey,
        ...options.headers
      }
    };
    
    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    
    const req = client.request(requestOptions, (res) => {
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
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function checkN8NStatus() {
  console.log('🔍 Checking N8N status...');
  
  try {
    const response = await makeRequest(`${N8N_CONFIG.baseUrl}/health`);
    if (response.status === 200) {
      console.log('✅ N8N is running');
      return true;
    } else {
      console.log('❌ N8N is not responding properly');
      return false;
    }
  } catch (error) {
    console.log('❌ N8N is not running or not accessible');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function importWorkflow() {
  console.log('📥 Importing Dr. Hassan MedleyAgent workflow...');
  
  try {
    // Read the workflow file
    const workflowData = fs.readFileSync(N8N_CONFIG.workflowFile, 'utf8');
    const workflows = JSON.parse(workflowData);
    
    // Import each workflow
    for (const workflow of workflows) {
      console.log(`   Importing workflow: ${workflow.name}`);
      
      const response = await makeRequest(`${N8N_CONFIG.baseUrl}/rest/workflows`, {
        method: 'POST',
        body: JSON.stringify(workflow)
      });
      
      if (response.status === 200 || response.status === 201) {
        console.log(`   ✅ Successfully imported: ${workflow.name}`);
        return response.data;
      } else {
        console.log(`   ❌ Failed to import: ${workflow.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        return null;
      }
    }
  } catch (error) {
    console.log('❌ Error importing workflow:');
    console.log(`   ${error.message}`);
    return null;
  }
}

async function activateWorkflow(workflowId) {
  console.log('🚀 Activating workflow...');
  
  try {
    const response = await makeRequest(`${N8N_CONFIG.baseUrl}/rest/workflows/${workflowId}/activate`, {
      method: 'POST'
    });
    
    if (response.status === 200) {
      console.log('✅ Workflow activated successfully');
      return true;
    } else {
      console.log('❌ Failed to activate workflow');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Error activating workflow:');
    console.log(`   ${error.message}`);
    return false;
  }
}

async function getWorkflowWebhookUrl(workflowId) {
  console.log('🔗 Getting webhook URL...');
  
  try {
    const response = await makeRequest(`${N8N_CONFIG.baseUrl}/rest/workflows/${workflowId}`);
    
    if (response.status === 200) {
      const workflow = response.data;
      const webhookNode = workflow.nodes.find(node => node.type === 'n8n-nodes-base.webhook');
      
      if (webhookNode) {
        const webhookId = webhookNode.webhookId;
        const webhookUrl = `${N8N_CONFIG.baseUrl}/webhook/${webhookId}`;
        console.log(`✅ Webhook URL: ${webhookUrl}`);
        return webhookUrl;
      } else {
        console.log('❌ No webhook node found in workflow');
        return null;
      }
    } else {
      console.log('❌ Failed to get workflow details');
      return null;
    }
  } catch (error) {
    console.log('❌ Error getting webhook URL:');
    console.log(`   ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Dr. Hassan MedleyAgent Workflow Activation');
  console.log('=============================================');
  
  // Check N8N status
  const n8nRunning = await checkN8NStatus();
  if (!n8nRunning) {
    console.log('\n💡 Please start N8N first:');
    console.log('   cd services/n8n');
    console.log('   docker-compose -f docker-compose.dev.yml up -d');
    process.exit(1);
  }
  
  // Import workflow
  const importedWorkflow = await importWorkflow();
  if (!importedWorkflow) {
    console.log('\n❌ Failed to import workflow');
    process.exit(1);
  }
  
  // Activate workflow
  const workflowId = importedWorkflow.id;
  const activated = await activateWorkflow(workflowId);
  if (!activated) {
    console.log('\n❌ Failed to activate workflow');
    process.exit(1);
  }
  
  // Get webhook URL
  const webhookUrl = await getWorkflowWebhookUrl(workflowId);
  if (!webhookUrl) {
    console.log('\n❌ Failed to get webhook URL');
    process.exit(1);
  }
  
  console.log('\n🎉 Dr. Hassan MedleyAgent Workflow is ready!');
  console.log('===========================================');
  console.log(`📡 Webhook URL: ${webhookUrl}`);
  console.log(`🏥 Demo ID: hassan`);
  console.log(`🏢 Company: Hassan Spine & Sports Medicine`);
  console.log(`🤖 Agent: Dr. Olivia Hassan`);
  
  console.log('\n🧪 To test the workflow, run:');
  console.log('   node scripts/test-dr-hassan-medley.js');
  
  console.log('\n📝 Update the webhook URL in the test script if needed:');
  console.log(`   ${webhookUrl}`);
}

// Run the activation
main().catch(console.error); 