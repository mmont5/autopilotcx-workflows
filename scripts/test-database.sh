#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to test database operation
test_db_operation() {
    local operation=$1
    local query=$2
    local expected_result=$3

    echo "Testing $operation..."
    
    response=$(curl -s -X POST "http://localhost:3000/api/database/execute" \
        -H "Content-Type: application/json" \
        -d "{\"query\":\"$query\"}")

    if [[ $response == *"$expected_result"* ]]; then
        echo -e "${GREEN}✓ Success${NC}"
        echo "Response: $response"
    else
        echo -e "${RED}✗ Failed${NC}"
        echo "Expected: $expected_result"
        echo "Got: $response"
    fi
    echo "---"
}

# Test table creation
test_db_operation "Create table" "CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)" "success"

# Test data insertion
test_db_operation "Insert data" "INSERT INTO test_table (name) VALUES ('test1'), ('test2')" "success"

# Test data selection
test_db_operation "Select data" "SELECT * FROM test_table" "test1"

# Test data update
test_db_operation "Update data" "UPDATE test_table SET name = 'updated' WHERE name = 'test1'" "success"

# Test data deletion
test_db_operation "Delete data" "DELETE FROM test_table WHERE name = 'test2'" "success"

# Test index creation
test_db_operation "Create index" "CREATE INDEX idx_test_name ON test_table(name)" "success"

# Test index usage
test_db_operation "Use index" "SELECT * FROM test_table WHERE name = 'updated'" "updated"

# Test table analysis
test_db_operation "Analyze table" "ANALYZE test_table" "success"

# Test table statistics
test_db_operation "Get statistics" "SELECT relname, n_live_tup FROM pg_stat_user_tables WHERE relname = 'test_table'" "test_table"

# Test error handling
test_db_operation "Invalid query" "SELECT * FROM nonexistent_table" "error"

# Test cleanup
test_db_operation "Drop table" "DROP TABLE test_table" "success" 