#!/bin/bash

# Quick test script for Dr. Hassan workflow

echo "🚀 Quick Dr. Hassan Workflow Test"
echo "================================="

WEBHOOK_URL="http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31"

# Test data
TEST_DATA='{
  "demoId": "hassan",
  "message": "Hello",
  "company_name": "Hassan Spine & Sports Medicine",
  "agent_name": "Olivia",
  "industry": "healthcare",
  "category": "pain_management"
}'

echo "📡 Testing webhook: $WEBHOOK_URL"
echo "📝 Test message: Hello"
echo ""

# Make the request
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" \
  "$WEBHOOK_URL")

echo "📊 Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

echo ""
echo "✅ Test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Import the workflow into N8N: http://localhost:5678"
echo "2. Use the file: n8n-project/dr-hassan-corrected-workflow.json"
echo "3. Activate the workflow"
echo "4. Run this test again"
echo "5. Test the demo platform: http://localhost:3000/demo/hassan" 