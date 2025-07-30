#!/bin/bash

# 🎼 AutopilotCX Orchestra Quick Test
# ====================================

echo "🎼 AutopilotCX Orchestra Quick Test"
echo "==================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test service
test_service() {
    local name=$1
    local url=$2
    local port=$3
    
    echo -n "  "
    if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name is running"
        return 0
    else
        echo -e "${RED}❌${NC} $name is not responding"
        return 1
    fi
}

# Function to test port
test_port() {
    local name=$1
    local port=$2
    
    echo -n "  "
    if lsof -i :$port > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name is running on port $port"
        return 0
    else
        echo -e "${RED}❌${NC} $name is not running on port $port"
        return 1
    fi
}

echo -e "${BLUE}Step 1: Checking core services...${NC}"

# Test core services
admin_running=false
demo_running=false
orchestrator_running=false

if test_service "Admin Dashboard" "http://localhost:3002" "3002"; then
    admin_running=true
fi

if test_service "Demo Client" "http://localhost:3000" "3000"; then
    demo_running=true
fi

# Check for orchestrator service
if test_port "Orchestrator" "3001"; then
    orchestrator_running=true
fi

echo ""
echo -e "${BLUE}Step 2: Checking additional services...${NC}"

# Test additional services that might be running
test_port "N8N Workflow Engine" "5678"
test_port "Supabase Studio" "54323"
test_port "Supabase Kong Gateway" "54321"

echo ""
echo -e "${BLUE}Step 3: Checking database connectivity...${NC}"

# Test database connectivity
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅${NC} PostgreSQL database is accessible"
else
    echo -e "  ${YELLOW}⚠️${NC} PostgreSQL database not accessible (may be running in Docker)"
fi

echo ""
echo -e "${BLUE}Step 4: Summary${NC}"

if [ "$admin_running" = true ] && [ "$demo_running" = true ]; then
    echo -e "${GREEN}🎉 Core services are running!${NC}"
    echo -e "${GREEN}   You can access:${NC}"
    echo -e "${GREEN}   • Admin Dashboard: http://localhost:3002${NC}"
    echo -e "${GREEN}   • Demo Client: http://localhost:3000${NC}"
    
    if [ "$orchestrator_running" = true ]; then
        echo -e "${GREEN}   • Orchestrator: http://localhost:3001${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}Ready to run comprehensive tests!${NC}"
    echo -e "${YELLOW}Run: ./scripts/test-orchestra-e2e.sh${NC}"
    exit 0
else
    echo -e "${RED}❌ Some core services are not running${NC}"
    echo -e "${YELLOW}Please ensure the following are started:${NC}"
    echo -e "${YELLOW}  • npm run dev (for Node.js services)${NC}"
    echo -e "${YELLOW}  • docker-compose up (for Python services)${NC}"
    exit 1
fi

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