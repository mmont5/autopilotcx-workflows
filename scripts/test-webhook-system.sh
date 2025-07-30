#!/bin/bash

# Test script for webhook system
# This script helps verify that all webhook components are working

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Webhook System Test${NC}"
echo "===================="

# Configuration
ADMIN_URL="http://localhost:3002"
SUPABASE_URL="http://localhost:54321"

# Test tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ((PASSED_TESTS++))
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ((FAILED_TESTS++))
            ;;
    esac
    ((TOTAL_TESTS++))
}

# Function to check if a service is running
check_service() {
    local service_name=$1
    local service_url=$2
    local max_attempts=5
    local attempt=1
    
    print_status "INFO" "Checking if $service_name is running at $service_url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --head "$service_url" > /dev/null 2>&1; then
            print_status "SUCCESS" "$service_name is running"
            return 0
        else
            print_status "WARNING" "Attempt $attempt/$max_attempts: $service_name not responding"
            sleep 1
            ((attempt++))
        fi
    done
    
    print_status "ERROR" "$service_name is not running after $max_attempts attempts"
    return 1
}

# Test 1: Check admin server
test_admin_server() {
    print_status "INFO" "Testing admin server..."
    
    if check_service "Admin Server" "$ADMIN_URL"; then
        print_status "SUCCESS" "Admin server is accessible"
    else
        print_status "ERROR" "Admin server is not accessible"
        return 1
    fi
}

# Test 2: Check webhook status endpoint
test_webhook_status() {
    print_status "INFO" "Testing webhook status endpoint..."
    
    local response=$(curl -s "$ADMIN_URL/api/webhook-status" 2>/dev/null || echo "{}")
    
    if echo "$response" | grep -q "configured"; then
        print_status "SUCCESS" "Webhook status endpoint is working"
        echo "  Response: $response"
    else
        print_status "ERROR" "Webhook status endpoint failed"
        echo "  Response: $response"
        return 1
    fi
}

# Test 3: Check Supabase webhook config
test_supabase_config() {
    print_status "INFO" "Testing Supabase webhook configuration..."
    
    local response=$(curl -s "$ADMIN_URL/api/webhook-config" 2>/dev/null || echo "{}")
    
    if echo "$response" | grep -q "webhookUrl"; then
        print_status "SUCCESS" "Supabase webhook config endpoint is working"
        echo "  Response: $response"
    else
        print_status "WARNING" "Supabase webhook config endpoint may not be working"
        echo "  Response: $response"
    fi
}

# Test 4: Check environment variables
test_env_vars() {
    print_status "INFO" "Testing environment variables..."
    
    if [ -f "apps/admin/.env.local" ]; then
        if grep -q "NGROK_BASE_URL" "apps/admin/.env.local"; then
            print_status "SUCCESS" "NGROK_BASE_URL is configured"
            local ngrok_url=$(grep "NGROK_BASE_URL" "apps/admin/.env.local" | cut -d'=' -f2)
            echo "  URL: $ngrok_url"
        else
            print_status "ERROR" "NGROK_BASE_URL is not configured"
            return 1
        fi
    else
        print_status "ERROR" ".env.local file not found"
        return 1
    fi
}

# Test 5: Check NGROK connectivity
test_ngrok_connectivity() {
    print_status "INFO" "Testing NGROK connectivity..."
    
    local ngrok_url=$(grep "NGROK_BASE_URL" "apps/admin/.env.local" | cut -d'=' -f2 2>/dev/null || echo "")
    
    if [ -z "$ngrok_url" ]; then
        print_status "ERROR" "NGROK_BASE_URL not found in .env.local"
        return 1
    fi
    
    if curl -s --head "$ngrok_url" > /dev/null 2>&1; then
        print_status "SUCCESS" "NGROK URL is accessible: $ngrok_url"
    else
        print_status "WARNING" "NGROK URL may not be accessible: $ngrok_url"
        echo "  This might be normal if NGROK is not currently running"
    fi
}

# Test 6: Manual webhook trigger test
test_manual_webhook() {
    print_status "INFO" "Testing manual webhook trigger..."
    
    # This would require a demo ID to test properly
    print_status "INFO" "To test manual webhook trigger, run:"
    echo "  curl -X POST '$ADMIN_URL/api/trigger-webhook?demoId=YOUR_DEMO_ID'"
    print_status "INFO" "Replace YOUR_DEMO_ID with an actual demo ID from your database"
}

# Run all tests
run_all_tests() {
    print_status "INFO" "Starting webhook system tests..."
    print_status "INFO" "=================================="
    
    test_admin_server
    test_webhook_status
    test_supabase_config
    test_env_vars
    test_ngrok_connectivity
    test_manual_webhook
    
    # Print summary
    echo ""
    print_status "INFO" "Test Summary"
    print_status "INFO" "============"
    echo "  Total tests: $TOTAL_TESTS"
    echo "  Passed: $PASSED_TESTS"
    echo "  Failed: $FAILED_TESTS"
    echo "  Warnings: $((TOTAL_TESTS - PASSED_TESTS - FAILED_TESTS))"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_status "SUCCESS" "All critical tests passed!"
        echo ""
        print_status "INFO" "Next steps:"
        echo "  1. Create a demo in the admin dashboard"
        echo "  2. Check N8N to verify webhook is received"
        echo "  3. Monitor logs for any issues"
    else
        print_status "ERROR" "Some tests failed. Please check the errors above."
        echo ""
        print_status "INFO" "Troubleshooting:"
        echo "  1. Ensure admin server is running: cd apps/admin && npm run dev"
        echo "  2. Update NGROK URL: ./scripts/update-ngrok-url.sh"
        echo "  3. Check Supabase is running and accessible"
    fi
}

# Run the tests
run_all_tests 