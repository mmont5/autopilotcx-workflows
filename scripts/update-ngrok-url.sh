#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Updating NGROK URL for AutopilotCX...${NC}"

# Check if NGROK is running
if ! curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    echo -e "${RED}❌ NGROK is not running. Please start NGROK first:${NC}"
    echo -e "${YELLOW}ngrok http 5678${NC}"
    exit 1
fi

# Get the current NGROK URL
ngrok_url=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ "$ngrok_url" = "null" ] || [ -z "$ngrok_url" ]; then
    echo -e "${RED}❌ Could not get NGROK URL. Please check if NGROK is running properly.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found NGROK URL: $ngrok_url${NC}"

# Update environment variables
echo -e "${BLUE}📝 Updating environment variables...${NC}"

# Update .env.local files
for env_file in "apps/admin/.env.local" "apps/client/.env.local" "apps/demo/.env.local"; do
    if [ -f "$env_file" ]; then
        # Update or add NGROK_BASE_URL
        if grep -q "NGROK_BASE_URL" "$env_file"; then
            sed -i.bak "s|NGROK_BASE_URL=.*|NGROK_BASE_URL=$ngrok_url|" "$env_file"
        else
            echo "NGROK_BASE_URL=$ngrok_url" >> "$env_file"
        fi
        
        # Update or add N8N_WEBHOOK_PATH
        if grep -q "N8N_WEBHOOK_PATH" "$env_file"; then
            sed -i.bak "s|N8N_WEBHOOK_PATH=.*|N8N_WEBHOOK_PATH=webhook/0a274e64-8902-4f73-ac54-7f37206c7a31|" "$env_file"
        else
            echo "N8N_WEBHOOK_PATH=webhook/0a274e64-8902-4f73-ac54-7f37206c7a31" >> "$env_file"
        fi
        
        echo -e "${GREEN}✅ Updated $env_file${NC}"
    fi
done

# Update Supabase webhook URL
echo -e "${BLUE}🗄️  Updating Supabase webhook URL...${NC}"

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    # Get the full webhook URL for Supabase
    webhook_path="webhook/0a274e64-8902-4f73-ac54-7f37206c7a31"
    full_webhook_url="$ngrok_url/$webhook_path"
    
    echo -e "${BLUE}Running Supabase migration to update webhook URL...${NC}"
    
    # Check if we can connect to Supabase
    if supabase status &> /dev/null; then
        # Execute the SQL to update the webhook URL using the new function
        echo "SELECT update_webhook_url('demo_created', '$full_webhook_url');" | supabase db reset --linked
        echo -e "${GREEN}✅ Updated Supabase webhook URL to: $full_webhook_url${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase not running or not linked. Please run the following SQL manually:${NC}"
        echo -e "${YELLOW}SELECT update_webhook_url('demo_created', '$full_webhook_url');${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Please update the webhook URL manually in Supabase:${NC}"
    echo -e "${YELLOW}SELECT update_webhook_url('demo_created', '$full_webhook_url');${NC}"
fi

# Create a simple test script
echo -e "${BLUE}🧪 Creating test script...${NC}"

cat > scripts/test-webhook.sh << 'EOF'
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
EOF

chmod +x scripts/test-webhook.sh

echo ""
echo -e "${GREEN}✅ NGROK URL updated successfully!${NC}"
echo -e "${BLUE}📊 Current configuration:${NC}"
echo "  NGROK_BASE_URL: $ngrok_url"
echo "  Full webhook URL: $ngrok_url/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31"
echo ""
echo -e "${YELLOW}⚠️  Note: You may need to restart your admin server for changes to take effect.${NC}"
echo -e "${YELLOW}Run: cd apps/admin && npm run dev${NC}"
echo ""
echo -e "${BLUE}🧪 To test the webhook:${NC}"
echo -e "${BLUE}1. Run: ./scripts/test-webhook.sh${NC}"
echo -e "${BLUE}2. Create a demo in the admin dashboard${NC}"
echo -e "${BLUE}3. Check the webhook status: curl http://localhost:3002/api/webhook-status${NC}"
echo -e "${BLUE}4. Verify N8N receives the webhook data${NC}"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}" 