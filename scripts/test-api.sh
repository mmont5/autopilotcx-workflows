#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Base URL
BASE_URL="http://localhost:3000/api"

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4

    echo "Testing $method $endpoint..."
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Success${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}✗ Failed${NC}"
        echo "Expected status: $expected_status"
        echo "Got status: $status_code"
        echo "Response: $body"
    fi
    echo "---"
}

# Test database optimization
test_endpoint "GET" "/database/optimization" "" 200

# Test table analysis
test_endpoint "GET" "/database/analyze/users" "" 200
test_endpoint "GET" "/database/analyze/organizations" "" 200
test_endpoint "GET" "/database/analyze/metrics" "" 200

# Test index management
test_endpoint "GET" "/database/indexes" "" 200

# Test index creation
test_endpoint "POST" "/database/indexes" '{"indexDef":"CREATE INDEX idx_users_email ON users(email)"}' 200

# Test index deletion
test_endpoint "DELETE" "/database/indexes" '{"indexName":"idx_users_email"}' 200

# Test error cases
test_endpoint "GET" "/database/analyze/nonexistent" "" 500
test_endpoint "POST" "/database/indexes" '{}' 400
test_endpoint "DELETE" "/database/indexes" '{}' 400

# Test rate limiting
echo "Testing rate limiting..."
for i in {1..101}; do
    if [ $i -eq 101 ]; then
        test_endpoint "GET" "/database/optimization" "" 429
    else
        test_endpoint "GET" "/database/optimization" "" 200
    fi
done

# Test security headers
echo "Testing security headers..."
headers=$(curl -s -I "$BASE_URL/database/optimization")
echo "$headers" | grep -i "content-security-policy" || echo -e "${RED}✗ Missing CSP header${NC}"
echo "$headers" | grep -i "x-frame-options" || echo -e "${RED}✗ Missing X-Frame-Options header${NC}"
echo "$headers" | grep -i "x-content-type-options" || echo -e "${RED}✗ Missing X-Content-Type-Options header${NC}"
echo "$headers" | grep -i "strict-transport-security" || echo -e "${RED}✗ Missing HSTS header${NC}"

# Test CORS
echo "Testing CORS..."
cors_headers=$(curl -s -I -H "Origin: http://localhost:3000" "$BASE_URL/database/optimization")
echo "$cors_headers" | grep -i "access-control-allow-origin" || echo -e "${RED}✗ Missing CORS headers${NC}"
echo "$cors_headers" | grep -i "access-control-allow-methods" || echo -e "${RED}✗ Missing CORS methods${NC}"
echo "$cors_headers" | grep -i "access-control-allow-headers" || echo -e "${RED}✗ Missing CORS headers${NC}" 