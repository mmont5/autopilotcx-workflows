#!/bin/bash

# Dr. Shady Hassan Demo - End-to-End Testing Script
# This script helps execute the comprehensive testing for Dr. Hassan's demo

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ADMIN_URL="http://localhost:3002"
DEMO_URL="http://localhost:3000/demo/[demoID]"
N8N_URL="http://localhost:5678"
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
    local max_attempts=30
    local attempt=1
    
    print_status "INFO" "Checking if $service_name is running at $service_url"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --head "$service_url" > /dev/null 2>&1; then
            print_status "SUCCESS" "$service_name is running"
            return 0
        else
            print_status "WARNING" "Attempt $attempt/$max_attempts: $service_name not responding"
            sleep 2
            ((attempt++))
        fi
    done
    
    print_status "ERROR" "$service_name is not running after $max_attempts attempts"
    return 1
}

# Function to test demo creation
test_demo_creation() {
    print_status "INFO" "Starting Phase 1: Demo Creation Testing"
    
    # Test 1: Check if admin dashboard is accessible
    if check_service "Admin Dashboard" "$ADMIN_URL/dashboard"; then
        print_status "SUCCESS" "Admin dashboard is accessible"
    else
        print_status "ERROR" "Cannot access admin dashboard"
        return 1
    fi
    
    # Test 2: Check if demo creation form is accessible
    if curl -s --head "$ADMIN_URL/dashboard/demos/new" > /dev/null 2>&1; then
        print_status "SUCCESS" "Demo creation form is accessible"
    else
        print_status "ERROR" "Cannot access demo creation form"
        return 1
    fi
    
    print_status "INFO" "Demo creation form testing completed"
    print_status "INFO" "Please manually complete the 10-step form using the 'Fill with Test Data' button"
    print_status "INFO" "Form URL: $ADMIN_URL/dashboard/demos/new"
}

# Function to test Supabase integration
test_supabase_integration() {
    print_status "INFO" "Starting Phase 2: Supabase Integration Testing"
    
    # Test 1: Check if Supabase is running
    if check_service "Supabase" "$SUPABASE_URL"; then
        print_status "SUCCESS" "Supabase is running"
    else
        print_status "ERROR" "Supabase is not running"
        return 1
    fi
    
    # Test 2: Check if demo table exists (this would require database access)
    print_status "INFO" "Please manually verify demo record creation in Supabase dashboard"
    print_status "INFO" "Supabase URL: $SUPABASE_URL"
    
    print_status "INFO" "Supabase integration testing completed"
}

# Function to test N8N workflow
test_n8n_workflow() {
    print_status "INFO" "Starting Phase 3: N8N Workflow Testing"
    
    # Test 1: Check if N8N is running
    if check_service "N8N" "$N8N_URL"; then
        print_status "SUCCESS" "N8N is running"
    else
        print_status "ERROR" "N8N is not running"
        return 1
    fi
    
    # Test 2: Check if Dr. Hassan workflow exists
    print_status "INFO" "Please manually verify Dr. Hassan workflow in N8N dashboard"
    print_status "INFO" "N8N URL: $N8N_URL"
    
    print_status "INFO" "N8N workflow testing completed"
}

# Function to test demo page rendering
test_demo_page() {
    print_status "INFO" "Starting Phase 4: Demo Page Rendering Testing"
    
    # Test 1: Check if demo platform is accessible
    if check_service "Demo Platform" "$DEMO_URL"; then
        print_status "SUCCESS" "Demo platform is accessible"
    else
        print_status "ERROR" "Cannot access demo platform"
        return 1
    fi
    
    print_status "INFO" "Please manually test demo page rendering after demo creation"
    print_status "INFO" "Demo platform URL: $DEMO_URL"
    
    print_status "INFO" "Demo page testing completed"
}

# Function to test AI chat interface
test_ai_chat() {
    print_status "INFO" "Starting Phase 5: AI Chat Interface Testing"
    
    print_status "INFO" "Please manually test AI chat interface with the following scenario:"
    print_status "INFO" "Patient: Angelica (24-year-old marathon runner with back pain)"
    print_status "INFO" "Initial message: 'Hi, I'm Angelica and I've been having back pain after running marathons. I'm looking for help.'"
    print_status "INFO" "Expected: AI should respond with empathy and mention Dr. Hassan's sports injury expertise"
    
    print_status "INFO" "AI chat testing completed"
}

# Function to test appointment booking
test_appointment_booking() {
    print_status "INFO" "Starting Phase 6: Appointment Booking Testing"
    
    print_status "INFO" "Please manually test appointment booking flow:"
    print_status "INFO" "1. Guide conversation toward appointment booking"
    print_status "INFO" "2. Verify calendar integration works"
    print_status "INFO" "3. Confirm appointment appears in Google Calendar"
    print_status "INFO" "4. Check Dr. Hassan receives notification"
    
    print_status "INFO" "Appointment booking testing completed"
}

# Function to test notifications and analytics
test_notifications_analytics() {
    print_status "INFO" "Starting Phase 7: Notifications and Analytics Testing"
    
    print_status "INFO" "Please manually verify:"
    print_status "INFO" "1. Dr. Hassan receives email notification"
    print_status "INFO" "2. Analytics are tracked in admin dashboard"
    print_status "INFO" "3. Conversation metrics are recorded"
    print_status "INFO" "4. Appointment booking is logged"
    
    print_status "INFO" "Notifications and analytics testing completed"
}

# Function to run all tests
run_all_tests() {
    print_status "INFO" "Starting Dr. Shady Hassan Demo End-to-End Testing"
    print_status "INFO" "=================================================="
    
    # Pre-test checks
    print_status "INFO" "Running pre-test service checks..."
    
    # Run all test phases
    test_demo_creation
    test_supabase_integration
    test_n8n_workflow
    test_demo_page
    test_ai_chat
    test_appointment_booking
    test_notifications_analytics
    
    # Print summary
    print_status "INFO" "=================================================="
    print_status "INFO" "Testing Summary:"
    print_status "INFO" "Total Tests: $TOTAL_TESTS"
    print_status "INFO" "Passed: $PASSED_TESTS"
    print_status "INFO" "Failed: $FAILED_TESTS"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_status "SUCCESS" "All automated tests passed!"
        print_status "INFO" "Please complete manual testing steps as outlined above"
    else
        print_status "ERROR" "$FAILED_TESTS tests failed. Please check the errors above"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Dr. Shady Hassan Demo - End-to-End Testing Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --all              Run all tests (default)"
    echo "  --demo-creation    Test demo creation only"
    echo "  --supabase         Test Supabase integration only"
    echo "  --n8n              Test N8N workflow only"
    echo "  --demo-page        Test demo page rendering only"
    echo "  --ai-chat          Test AI chat interface only"
    echo "  --appointment      Test appointment booking only"
    echo "  --notifications    Test notifications and analytics only"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Run all tests"
    echo "  $0 --demo-creation # Test only demo creation"
    echo "  $0 --help          # Show this help"
}

# Main script logic
case "${1:---all}" in
    --all)
        run_all_tests
        ;;
    --demo-creation)
        test_demo_creation
        ;;
    --supabase)
        test_supabase_integration
        ;;
    --n8n)
        test_n8n_workflow
        ;;
    --demo-page)
        test_demo_page
        ;;
    --ai-chat)
        test_ai_chat
        ;;
    --appointment)
        test_appointment_booking
        ;;
    --notifications)
        test_notifications_analytics
        ;;
    --help)
        show_help
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac

print_status "INFO" "Testing script completed"
print_status "INFO" "Refer to docs/testing/DR_HASSAN_DEMO_E2E_TESTING.md for detailed manual testing steps" 