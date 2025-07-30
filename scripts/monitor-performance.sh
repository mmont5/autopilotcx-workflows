#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to measure performance
measure_performance() {
    local endpoint=$1
    local method=$2
    local data=$3
    local iterations=$4

    echo -e "\n${YELLOW}Measuring performance for $method $endpoint...${NC}"
    
    total_time=0
    min_time=999999
    max_time=0
    success_count=0
    error_count=0

    for ((i=1; i<=$iterations; i++)); do
        start_time=$(date +%s%N)
        
        if [ -z "$data" ]; then
            response=$(curl -s -w "\n%{http_code}" -X $method "http://localhost:3000/api$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "http://localhost:3000/api$endpoint")
        fi

        end_time=$(date +%s%N)
        duration=$(echo "scale=3; ($end_time - $start_time) / 1000000" | bc)
        
        status_code=$(echo "$response" | tail -n1)
        
        if [ "$status_code" -eq "200" ]; then
            success_count=$((success_count + 1))
        else
            error_count=$((error_count + 1))
        fi

        total_time=$(echo "$total_time + $duration" | bc)
        
        if (( $(echo "$duration < $min_time" | bc -l) )); then
            min_time=$duration
        fi
        
        if (( $(echo "$duration > $max_time" | bc -l) )); then
            max_time=$duration
        fi
    done

    avg_time=$(echo "scale=3; $total_time / $iterations" | bc)
    
    echo "Iterations: $iterations"
    echo "Success Rate: $((success_count * 100 / iterations))%"
    echo "Error Rate: $((error_count * 100 / iterations))%"
    echo "Average Response Time: ${avg_time}ms"
    echo "Min Response Time: ${min_time}ms"
    echo "Max Response Time: ${max_time}ms"
    echo "---"
}

# Test database optimization performance
measure_performance "/database/optimization" "GET" "" 10

# Test table analysis performance
measure_performance "/database/analyze/users" "GET" "" 10

# Test index management performance
measure_performance "/database/indexes" "GET" "" 10
measure_performance "/database/indexes" "POST" '{"indexDef":"CREATE INDEX idx_users_email ON users(email)"}' 10
measure_performance "/database/indexes" "DELETE" '{"indexName":"idx_users_email"}' 10

# Test concurrent performance
echo -e "\n${YELLOW}Testing Concurrent Performance${NC}"
for i in {1..5}; do
    measure_performance "/database/optimization" "GET" "" 5 &
done
wait

# Test database query performance
echo -e "\n${YELLOW}Testing Database Query Performance${NC}"
measure_performance "/database/execute" "POST" '{"query":"SELECT * FROM users LIMIT 1"}' 10
measure_performance "/database/execute" "POST" '{"query":"SELECT * FROM users JOIN organizations ON users.org_id = organizations.id"}' 10

# Test error handling performance
echo -e "\n${YELLOW}Testing Error Handling Performance${NC}"
measure_performance "/database/execute" "POST" '{"query":"SELECT * FROM nonexistent_table"}' 10 