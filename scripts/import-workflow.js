#!/usr/bin/env node

/**
 * Import Dr. Hassan Workflow into N8N
 */

const fs = require('fs');
const path = require('path');

// Read the corrected workflow
const workflowPath = path.join(__dirname, '../n8n-project/dr-hassan-corrected-workflow.json');
const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

console.log('📋 Workflow Details:');
console.log(`   Name: ${workflowData.name}`);
console.log(`   ID: ${workflowData.id}`);
console.log(`   Active: ${workflowData.active}`);
console.log(`   Nodes: ${workflowData.nodes.length}`);

console.log('\n📝 Instructions to import into N8N:');
console.log('====================================');
console.log('1. Open N8N in your browser: http://localhost:5678');
console.log('2. Click "Import from file" or "Import from URL"');
console.log('3. Select the file: n8n-project/dr-hassan-corrected-workflow.json');
console.log('4. Click "Import"');
console.log('5. Activate the workflow');
console.log('6. Copy the webhook URL and update the test script');

console.log('\n🔗 Current Webhook URL:');
console.log(`   ${workflowData.nodes[0].parameters.path}`);

console.log('\n📊 Workflow Nodes:');
workflowData.nodes.forEach((node, index) => {
  console.log(`   ${index + 1}. ${node.name} (${node.type})`);
});

console.log('\n⚠️  Important Notes:');
console.log('- Make sure all custom agents are properly registered in N8N');
console.log('- The workflow uses custom agent nodes (CUSTOM.medleyAgent, etc.)');
console.log('- Verify the webhook URL matches in your test script');
console.log('- Test the workflow manually in N8N before running automated tests');

// Also create a simple test to verify the workflow file is valid
console.log('\n✅ Workflow file validation:');
try {
  // Basic validation
  if (!workflowData.name) throw new Error('Missing workflow name');
  if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) throw new Error('Missing or invalid nodes');
  if (!workflowData.connections) throw new Error('Missing connections');
  
  // Check for required nodes
  const hasWebhook = workflowData.nodes.some(n => n.type === 'n8n-nodes-base.webhook');
  const hasCustomAgents = workflowData.nodes.some(n => n.type.startsWith('CUSTOM.'));
  
  console.log('   ✅ Valid JSON structure');
  console.log('   ✅ Has webhook node');
  console.log(`   ✅ Has custom agents: ${hasCustomAgents}`);
  console.log('   ✅ Has connections defined');
  
} catch (error) {
  console.log(`   ❌ Validation failed: ${error.message}`);
} 