# Workflow Testing Framework

## Overview
The AutopilotCX Workflow Testing Framework provides comprehensive testing capabilities for workflows, including unit testing, integration testing, end-to-end testing, performance testing, and load testing.

## Test Types

### 1. Unit Tests
- Test individual workflow steps
- Validate step logic
- Mock external dependencies
- Test error handling
- Verify input/output

### 2. Integration Tests
- Test step interactions
- Validate data flow
- Test state transitions
- Verify error propagation
- Test recovery mechanisms

### 3. End-to-End Tests
- Test complete workflows
- Validate business logic
- Test real integrations
- Verify end-to-end flow
- Test error scenarios

### 4. Performance Tests
- Measure execution time
- Test resource usage
- Validate scalability
- Test concurrent executions
- Measure throughput

### 5. Load Tests
- Test under heavy load
- Validate system stability
- Test resource limits
- Measure response times
- Test failure scenarios

## Test Suite Management

### Creating Test Suites
```python
test_suite = {
    "workflow_id": workflow_id,
    "test_type": TestType.UNIT,
    "test_cases": [
        {
            "name": "Test Case 1",
            "input": {
                "key": "value"
            },
            "expected_output": {
                "result": "expected"
            }
        }
    ]
}
```

### Test Case Structure
```python
{
    "name": str,              # Test case name
    "description": str,       # Test case description
    "input": dict,           # Input data
    "expected_output": dict,  # Expected output
    "timeout": int,          # Optional timeout
    "dependencies": list,     # Optional dependencies
    "setup": dict,           # Optional setup
    "teardown": dict         # Optional teardown
}
```

## Test Execution

### Running Tests
```python
# Run test suite
results = await tester.run_test_suite(
    workflow_id=workflow_id,
    test_type=TestType.UNIT,
    timeout=300
)

# Run single test case
result = await tester._run_test_case(
    workflow_id=workflow_id,
    test_case=test_case,
    timeout=60
)
```

### Test Results
```python
{
    "name": str,              # Test name
    "status": TestStatus,     # Test status
    "started_at": datetime,   # Start time
    "completed_at": datetime, # End time
    "input": dict,           # Input data
    "expected_output": dict,  # Expected output
    "actual_output": dict,    # Actual output
    "error": str             # Error message if failed
}
```

## Test Status

### Status Types
```python
class TestStatus(Enum):
    PENDING = "pending"   # Test not started
    RUNNING = "running"   # Test in progress
    PASSED = "passed"     # Test passed
    FAILED = "failed"     # Test failed
    SKIPPED = "skipped"   # Test skipped
```

## Test Data Management

### Storing Test Data
```python
# Store in Redis
suite_key = f"workflow:test:{workflow_id}:{test_type.value}"
redis.set(suite_key, str(test_suite))
redis.expire(suite_key, timedelta(hours=24))
```

### Retrieving Test Data
```python
# Get from Redis
test_suite = redis.get(suite_key)
if test_suite:
    return eval(test_suite.decode())
```

### Cleaning Up Test Data
```python
# Clean up old data
cutoff = datetime.utcnow() - timedelta(days=7)
pattern = "workflow:test:*"

for key in redis.scan_iter(match=pattern):
    test_suite = redis.get(key)
    if test_suite:
        suite = eval(test_suite.decode())
        if datetime.fromisoformat(suite["created_at"]) < cutoff:
            redis.delete(key)
```

## API Usage

### Creating Test Suite
```python
POST /api/v1/testing/workflows/{workflow_id}/test-suites
{
    "test_cases": [
        {
            "name": "Test Case 1",
            "input": {...},
            "expected_output": {...}
        }
    ],
    "test_type": "unit"
}
```

### Running Tests
```python
POST /api/v1/testing/workflows/{workflow_id}/test-suites/{test_type}/run
{
    "timeout": 300
}
```

### Getting Results
```python
GET /api/v1/testing/workflows/{workflow_id}/test-results
{
    "test_type": "unit"  # Optional
}
```

### Cleaning Up
```python
POST /api/v1/testing/test-data/cleanup
{
    "days": 7
}
```

## Best Practices

### 1. Test Design
- Write clear test cases
- Use meaningful names
- Include descriptions
- Set appropriate timeouts
- Handle dependencies

### 2. Test Coverage
- Test happy path
- Test error cases
- Test edge cases
- Test performance
- Test security

### 3. Test Maintenance
- Keep tests up to date
- Remove obsolete tests
- Update test data
- Monitor test results
- Clean up test data

### 4. Test Execution
- Run tests regularly
- Monitor execution time
- Handle timeouts
- Log test results
- Report failures

## Troubleshooting

### Common Issues
1. Test timeouts
   - Check timeout settings
   - Review test complexity
   - Monitor resource usage
   - Check dependencies

2. Test failures
   - Review error messages
   - Check input data
   - Verify expectations
   - Check dependencies

3. Performance issues
   - Monitor execution time
   - Check resource usage
   - Review test design
   - Optimize test cases

### Debugging
1. Enable debug logging
2. Review test results
3. Check test data
4. Monitor execution
5. Review error patterns 