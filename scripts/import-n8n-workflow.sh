#!/bin/bash

# Import Dr. Hassan Chat Workflow into N8N
echo "Importing Dr. Hassan Chat Workflow into N8N..."

# Check if N8N is running
if ! curl -s http://localhost:5678/health > /dev/null; then
    echo "Error: N8N is not running on localhost:5678"
    echo "Please start N8N first: cd n8n && docker-compose up -d"
    exit 1
fi

# Import the workflow
echo "Importing workflow from n8n-project/dr-hassan-chat-webhook.json..."
curl -X POST http://localhost:5678/rest/workflows \
  -H "Content-Type: application/json" \
  -d @n8n-project/dr-hassan-chat-webhook.json

echo "Workflow imported successfully!"
echo "You can now test the chat at: http://localhost:3000/demo/hassan" 