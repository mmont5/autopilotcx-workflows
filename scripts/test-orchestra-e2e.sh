#!/bin/bash

# AutopilotCX Orchestra End-to-End Testing Script
# This script tests all components of the AI orchestra working together

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Configuration
BASE_URL="http://localhost"
ADMIN_PORT="3002"
DEMO_PORT="3000"
KB_PORT="9500"
AI_PORT="8300"
N8N_PORT="5678"

# Helper functions
print_status() {
    local level=$1
    local message=$2
    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "TEST")
            echo -e "${PURPLE}[TEST]${NC} $message"
            ;;
    esac
}

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "TEST" "Running: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ "$expected_status" = "success" ]; then
            print_status "SUCCESS" "✓ $test_name passed"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            print_status "ERROR" "✗ $test_name failed (expected failure but got success)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        if [ "$expected_status" = "success" ]; then
            print_status "ERROR" "✗ $test_name failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        else
            print_status "SUCCESS" "✓ $test_name passed (expected failure)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
        fi
    fi
}

check_service_health() {
    local service_name="$1"
    local service_url="$2"
    
    print_status "INFO" "Checking $service_name health..."
    if curl -s "$service_url/health" > /dev/null 2>&1; then
        print_status "SUCCESS" "$service_name is healthy"
        return 0
    else
        print_status "ERROR" "$service_name is not responding"
        return 1
    fi
}

# Phase 1: Environment Setup & Pre-Testing
test_environment_setup() {
    print_status "INFO" "=== Phase 1: Environment Setup & Pre-Testing ==="
    
    # Check if all services are running
    run_test "Admin Dashboard Health" "check_service_health 'Admin Dashboard' '$BASE_URL:$ADMIN_PORT'" "success"
    run_test "Demo Client Health" "check_service_health 'Demo Client' '$BASE_URL:$DEMO_PORT'" "success"
    run_test "Knowledge Base Health" "check_service_health 'Knowledge Base' '$BASE_URL:$KB_PORT'" "success"
    run_test "AI Service Health" "check_service_health 'AI Service' '$BASE_URL:$AI_PORT'" "success"
    run_test "N8N Workflow Engine Health" "check_service_health 'N8N' '$BASE_URL:$N8N_PORT'" "success"
    
    # Check database connectivity
    run_test "Database Connectivity" "curl -s '$BASE_URL:$ADMIN_PORT/api/v1/health/db' | grep -q 'connected'" "success"
    
    # Check agent registration
    run_test "Agent Registration" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/agents/register' -H 'Content-Type: application/json' -d '{\"agents\": [\"maestro\", \"conductor\", \"harmony\"]}' | grep -q 'registered'" "success"
}

# Phase 2: Knowledge Base Integration Testing
test_knowledge_base_integration() {
    print_status "INFO" "=== Phase 2: Knowledge Base Integration Testing ==="
    
    # Test authoritative sites ingestion
    run_test "Authoritative Sites Ingestion" "curl -s -X POST '$BASE_URL:$KB_PORT/api/v1/ingest' -H 'Content-Type: application/json' -d '{\"source\": \"test-site\", \"url\": \"https://test.com\", \"reliability_score\": 95}' | grep -q 'ingested'" "success"
    
    # Test semantic search
    run_test "Semantic Search" "curl -s -X POST '$BASE_URL:$KB_PORT/api/v1/search/semantic' -H 'Content-Type: application/json' -d '{\"query\": \"back pain treatment\", \"context\": {\"industry\": \"healthcare\"}}' | grep -q 'results'" "success"
    
    # Test knowledge federation
    run_test "Knowledge Federation" "curl -s -X POST '$BASE_URL:$KB_PORT/api/v1/knowledge/federate' -H 'Content-Type: application/json' -d '{\"source_demo\": \"test1\", \"target_demo\": \"test2\"}' | grep -q 'federated'" "success"
}

# Phase 3: Agent Intelligence & Learning Testing
test_agent_intelligence() {
    print_status "INFO" "=== Phase 3: Agent Intelligence & Learning Testing ==="
    
    # Test Q-learning
    run_test "Q-Learning Decision Making" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/agents/intelligence/learn' -H 'Content-Type: application/json' -d '{\"agent_id\": \"virtuoso\", \"state\": {\"user_intent\": \"appointment_booking\"}, \"action\": \"offer_appointment\", \"reward\": 0.8}' | grep -q 'learned'" "success"
    
    # Test pattern recognition
    run_test "Pattern Recognition" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/agents/intelligence/patterns' -H 'Content-Type: application/json' -d '{\"agent_id\": \"virtuoso\", \"interaction_data\": {\"outcome\": \"successful_booking\"}}' | grep -q 'pattern'" "success"
    
    # Test rapid learning
    run_test "Rapid Learning" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/learning/rapid' -H 'Content-Type: application/json' -d '{\"domain_id\": \"test-domain\", \"client_data\": {\"services\": [\"test-service\"]}}' | grep -q 'learning'" "success"
}

# Phase 4: Orchestra Agent Coordination Testing
test_orchestra_coordination() {
    print_status "INFO" "=== Phase 4: Orchestra Agent Coordination Testing ==="
    
    # Test message routing
    run_test "Message Routing" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/conductor/message' -H 'Content-Type: application/json' -d '{\"from\": \"user\", \"to\": \"virtuoso\", \"type\": \"chat_message\", \"content\": \"test message\"}' | grep -q 'routed'" "success"
    
    # Test agent collaboration
    run_test "Agent Collaboration" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/harmony/collaborate' -H 'Content-Type: application/json' -d '{\"task\": \"test_task\", \"agents\": [\"virtuoso\", \"score\"]}' | grep -q 'collaborating'" "success"
    
    # Test workflow orchestration
    run_test "Workflow Orchestration" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/maestro/orchestrate' -H 'Content-Type: application/json' -d '{\"workflow\": \"test_workflow\", \"user_context\": {\"name\": \"test\"}}' | grep -q 'orchestrating'" "success"
}

# Phase 5: Continuous Learning & Improvement Testing
test_continuous_learning() {
    print_status "INFO" "=== Phase 5: Continuous Learning & Improvement Testing ==="
    
    # Test interaction recording
    run_test "Interaction Recording" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/interactions/record' -H 'Content-Type: application/json' -d '{\"conversation_id\": \"test_conv\", \"patient_message\": \"test message\", \"outcome\": \"success\"}' | grep -q 'recorded'" "success"
    
    # Test pattern analysis
    run_test "Pattern Analysis" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/learning/analyze' -H 'Content-Type: application/json' -d '{\"interaction_id\": \"test_conv\", \"analysis_type\": \"success_pattern\"}' | grep -q 'analyzed'" "success"
    
    # Test knowledge refresh
    run_test "Knowledge Refresh" "curl -s -X POST '$BASE_URL:$KB_PORT/api/v1/refresh' -H 'Content-Type: application/json' -d '{\"sources\": [\"test-source\"], \"frequency\": \"daily\"}' | grep -q 'refreshed'" "success"
}

# Phase 6: Analytics & Performance Testing
test_analytics_performance() {
    print_status "INFO" "=== Phase 6: Analytics & Performance Testing ==="
    
    # Test analytics tracking
    run_test "Analytics Tracking" "curl -s -X POST '$BASE_URL:$KB_PORT/api/v1/analytics/track' -H 'Content-Type: application/json' -d '{\"knowledge_id\": \"test_kb\", \"access_type\": \"search\", \"success\": true}' | grep -q 'tracked'" "success"
    
    # Test performance monitoring
    run_test "Performance Monitoring" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/metrics/record' -H 'Content-Type: application/json' -d '{\"agent_id\": \"virtuoso\", \"metric\": \"response_time\", \"value\": 0.8}' | grep -q 'recorded'" "success"
    
    # Test success tracking
    run_test "Success Tracking" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/success/track' -H 'Content-Type: application/json' -d '{\"demo_id\": \"test-demo\", \"metric\": \"appointment_bookings\", \"value\": 1}' | grep -q 'tracked'" "success"
}

# Phase 7: End-to-End Demo Testing
test_demo_e2e() {
    print_status "INFO" "=== Phase 7: End-to-End Demo Testing ==="
    
    # Test demo creation
    run_test "Demo Creation" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/demos/create' -H 'Content-Type: application/json' -d '{\"requestor\": {\"name\": \"Test User\"}, \"client\": {\"name\": \"Test Client\", \"industry\": \"healthcare\"}}' | grep -q 'created'" "success"
    
    # Test demo page access
    run_test "Demo Page Access" "curl -s '$BASE_URL:$DEMO_PORT/demo/test-demo' | grep -q 'Demo'" "success"
    
    # Test chat initialization
    run_test "Chat Initialization" "curl -s -X POST '$BASE_URL:$DEMO_PORT/api/v1/chat/init' -H 'Content-Type: application/json' -d '{\"demo_id\": \"test-demo\", \"user_context\": {\"name\": \"Test User\"}}' | grep -q 'initialized'" "success"
    
    # Test chat message
    run_test "Chat Message" "curl -s -X POST '$BASE_URL:$DEMO_PORT/api/v1/chat/message' -H 'Content-Type: application/json' -d '{\"demo_id\": \"test-demo\", \"message\": \"Hello\", \"session_id\": \"test_session\"}' | grep -q 'response'" "success"
}

# Phase 8: Performance & Load Testing
test_performance_load() {
    print_status "INFO" "=== Phase 8: Performance & Load Testing ==="
    
    # Test response time
    local start_time=$(date +%s.%N)
    curl -s "$BASE_URL:$DEMO_PORT/api/v1/chat/message" > /dev/null
    local end_time=$(date +%s.%N)
    local response_time=$(echo "$end_time - $start_time" | bc)
    
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        print_status "SUCCESS" "Response time: ${response_time}s (under 1s threshold)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_status "WARNING" "Response time: ${response_time}s (over 1s threshold)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Test concurrent requests
    run_test "Concurrent Requests" "for i in {1..10}; do curl -s '$BASE_URL:$DEMO_PORT/api/v1/chat/message' & done; wait" "success"
}

# Phase 9: Integration Testing
test_integration() {
    print_status "INFO" "=== Phase 9: Integration Testing ==="
    
    # Test complete workflow
    run_test "Complete Workflow" "curl -s -X POST '$BASE_URL:$ADMIN_PORT/api/v1/workflows/execute' -H 'Content-Type: application/json' -d '{\"workflow\": \"patient_onboarding\", \"user\": {\"name\": \"Test Patient\"}}' | grep -q 'completed'" "success"
    
    # Test data flow between services
    run_test "Data Flow" "curl -s '$BASE_URL:$ADMIN_PORT/api/v1/integration/status' | grep -q 'connected'" "success"
    
    # Test error handling
    run_test "Error Handling" "curl -s -X POST '$BASE_URL:$DEMO_PORT/api/v1/chat/message' -H 'Content-Type: application/json' -d '{\"invalid\": \"data\"}' | grep -q 'error'" "success"
}

# Phase 10: Final Validation
test_final_validation() {
    print_status "INFO" "=== Phase 10: Final Validation ==="
    
    # Test system health after all tests
    run_test "Final System Health" "check_service_health 'Complete System' '$BASE_URL:$ADMIN_PORT'" "success"
    
    # Test data consistency
    run_test "Data Consistency" "curl -s '$BASE_URL:$ADMIN_PORT/api/v1/health/data' | grep -q 'consistent'" "success"
    
    # Test configuration validation
    run_test "Configuration Validation" "curl -s '$BASE_URL:$ADMIN_PORT/api/v1/config/validate' | grep -q 'valid'" "success"
}

# Main test execution
run_all_tests() {
    print_status "INFO" "🎼 Starting AutopilotCX Orchestra End-to-End Testing"
    print_status "INFO" "=================================================="
    
    # Run all test phases
    test_environment_setup
    test_knowledge_base_integration
    test_agent_intelligence
    test_orchestra_coordination
    test_continuous_learning
    test_analytics_performance
    test_demo_e2e
    test_performance_load
    test_integration
    test_final_validation
    
    # Print summary
    print_status "INFO" "=================================================="
    print_status "INFO" "🎯 Testing Summary:"
    print_status "INFO" "Total Tests: $TOTAL_TESTS"
    print_status "INFO" "Passed: $PASSED_TESTS"
    print_status "INFO" "Failed: $FAILED_TESTS"
    print_status "INFO" "Success Rate: $((PASSED_TESTS * 100 / TOTAL_TESTS))%"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_status "SUCCESS" "🎉 All automated tests passed! Your orchestra is performing beautifully!"
        print_status "INFO" "Next steps:"
        print_status "INFO" "1. Run manual testing as outlined in docs/ORCHESTRA_E2E_TESTING_PLAN.md"
        print_status "INFO" "2. Review performance metrics"
        print_status "INFO" "3. Prepare for production deployment"
    else
        print_status "ERROR" "❌ $FAILED_TESTS tests failed. Please check the errors above"
        print_status "INFO" "Review failed tests and fix issues before proceeding"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "AutopilotCX Orchestra End-to-End Testing Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --all              Run all tests (default)"
    echo "  --environment      Test environment setup only"
    echo "  --knowledge        Test knowledge base integration only"
    echo "  --intelligence     Test agent intelligence only"
    echo "  --coordination     Test orchestra coordination only"
    echo "  --learning         Test continuous learning only"
    echo "  --analytics        Test analytics and performance only"
    echo "  --demo             Test demo e2e only"
    echo "  --performance      Test performance and load only"
    echo "  --integration      Test integration only"
    echo "  --validation       Test final validation only"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Run all tests"
    echo "  $0 --environment   # Test only environment setup"
    echo "  $0 --help          # Show this help"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "INFO" "Checking prerequisites..."
    
    if ! command -v curl &> /dev/null; then
        print_status "ERROR" "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v bc &> /dev/null; then
        print_status "ERROR" "bc is required but not installed"
        exit 1
    fi
    
    print_status "SUCCESS" "All prerequisites are installed"
}

# Main script logic
main() {
    check_prerequisites
    
    case "${1:---all}" in
        --all)
            run_all_tests
            ;;
        --environment)
            test_environment_setup
            ;;
        --knowledge)
            test_knowledge_base_integration
            ;;
        --intelligence)
            test_agent_intelligence
            ;;
        --coordination)
            test_orchestra_coordination
            ;;
        --learning)
            test_continuous_learning
            ;;
        --analytics)
            test_analytics_performance
            ;;
        --demo)
            test_demo_e2e
            ;;
        --performance)
            test_performance_load
            ;;
        --integration)
            test_integration
            ;;
        --validation)
            test_final_validation
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
    
    print_status "INFO" "🎼 Testing script completed"
    print_status "INFO" "Refer to docs/ORCHESTRA_E2E_TESTING_PLAN.md for detailed manual testing steps"
}

# Run main function with all arguments
main "$@" 