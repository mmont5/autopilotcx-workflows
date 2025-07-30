#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Testing webhook configuration...${NC}"

# Test Supabase webhook
if command -v supabase &> /dev/null; then
    echo -e "${BLUE}Testing Supabase webhook...${NC}"
    result=$(echo "SELECT test_webhook('demo_created');" | supabase db reset --linked 2>/dev/null | grep -o '{.*}' | head -1)
    
    if echo "$result" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Supabase webhook test successful${NC}"
    else
        echo -e "${RED}❌ Supabase webhook test failed${NC}"
        echo "Result: $result"
    fi
else
    echo -e "${RED}❌ Supabase CLI not available for testing${NC}"
fi

# Test N8N webhook endpoint
ngrok_url=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
if [ "$ngrok_url" != "null" ] && [ -n "$ngrok_url" ]; then
    webhook_url="$ngrok_url/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31"
    echo -e "${BLUE}Testing N8N webhook endpoint: $webhook_url${NC}"
    
    response=$(curl -s -w "%{http_code}" -X POST "$webhook_url" \
        -H "Content-Type: application/json" \
        -d '{"test": true, "message": "Webhook test"}' \
        -o /tmp/webhook_response.json)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ N8N webhook endpoint responding${NC}"
    else
        echo -e "${RED}❌ N8N webhook endpoint not responding (HTTP $response)${NC}"
    fi
else
    echo -e "${RED}❌ NGROK not running${NC}"
fi

echo -e "${BLUE}🧪 Webhook testing complete${NC}"
