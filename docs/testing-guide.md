# Testing Guide

**Created:** January 2025  
**Last Updated:** January 2025  
**Status:** Production Ready - All testing procedures implemented

## Overview
This document consolidates all testing procedures, end-to-end testing, and quick testing guides into a single comprehensive testing reference.

## Quick Testing

### Local Development Testing
```bash
# 1. Start all services
docker-compose up -d

# 2. Check service status
docker-compose ps

# 3. Test demo platform
curl -I http://localhost:3000

# 4. Test admin dashboard
curl -I http://localhost:3002

# 5. Test N8N workflow engine
curl -I http://localhost:5678

# 6. Test LLM server
curl -I http://localhost:8200
```

### Service Health Checks
- **Demo Platform:** `http://localhost:3000` ✅
- **Admin Dashboard:** `http://localhost:3002` ✅
- **N8N Workflow:** `http://localhost:5678` ✅
- **LLM Server:** `http://localhost:8200` ✅
- **API Gateway:** `http://localhost:8000` ✅
- **Supabase:** `http://localhost:54321` ✅

## End-to-End Testing

### Dr. Hassan Demo Testing

#### 1. Demo Access Test
```bash
# Test demo URL
curl -I http://localhost:3000/demo/bd5aa8b2-84fa-4b64-986d-7458b680b5b9
```

#### 2. Chat Interface Test
```bash
# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31 \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "demoId": "bd5aa8b2-84fa-4b64-986d-7458b680b5b9"}'
```

#### 3. Booking Flow Test
```bash
# Test appointment booking
curl -X POST http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31 \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to book an appointment", "demoId": "bd5aa8b2-84fa-4b64-986d-7458b680b5b9"}'
```

### Test Scenarios

#### Emergency Scenario
**Input:** "I have severe chest pain"
**Expected:** Emergency instructions and human escalation
**Test:** Verify emergency routing and response

#### Clinical Scenario
**Input:** "My back hurts when I sit"
**Expected:** Empathetic response with appointment options
**Test:** Verify clinical routing and medical response

#### Appointment Scenario
**Input:** "I want to book an appointment"
**Expected:** Complete booking flow initiation
**Test:** Verify booking flow and Google Calendar integration

#### Billing Scenario
**Input:** "Do you accept Blue Cross insurance?"
**Expected:** Insurance information and verification
**Test:** Verify billing routing and insurance response

#### General Scenario
**Input:** "What are your hours?"
**Expected:** Office hours and location information
**Test:** Verify general routing and information response

## Performance Testing

### Load Testing
```bash
# Test webhook performance
ab -n 100 -c 10 -p test_data.json -T application/json \
  http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31
```

### Response Time Testing
```bash
# Test LLM response time
time curl -X POST http://localhost:8200/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello", "max_tokens": 100}'
```

### Memory Usage Testing
```bash
# Check service memory usage
docker stats --no-stream
```

## Integration Testing

### API Gateway Testing
```bash
# Test API endpoints
curl -X GET http://localhost:8000/health
curl -X GET http://localhost:8000/api/v1/demos
```

### Database Testing
```bash
# Test Supabase connection
curl -X GET http://localhost:54321/rest/v1/demo \
  -H "apikey: your-anon-key"
```

### LLM Server Testing
```bash
# Test LLM completion
curl -X POST http://localhost:8200/v1/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, I need help with back pain",
    "max_tokens": 150,
    "temperature": 0.7
  }'
```

## Automated Testing

### Test Scripts
```bash
# Run quick test
./scripts/quick-test.sh

# Run Dr. Hassan demo test
./scripts/test-dr-hassan-demo.sh

# Run workflow test
./scripts/test-workflow.sh
```

### CI/CD Testing
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:demo
npm run test:workflow
npm run test:api
```

## Production Testing

### Pre-Deployment Checklist
- [ ] All services running
- [ ] Webhooks properly configured
- [ ] LLM integration working
- [ ] Database connections stable
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured

### Post-Deployment Testing
- [ ] Demo platform accessible
- [ ] Chat interface responsive
- [ ] Booking flow functional
- [ ] Error handling working
- [ ] Performance acceptable
- [ ] Analytics tracking

## Debugging

### Common Issues

#### 1. Webhook Not Triggering
```bash
# Check webhook status
curl -X GET http://localhost:5678/api/v1/webhooks

# Check webhook logs
docker logs n8n | grep webhook
```

#### 2. LLM Not Responding
```bash
# Check LLM server status
curl -X GET http://localhost:8200/health

# Check LLM logs
docker logs llm-server
```

#### 3. Database Connection Issues
```bash
# Check Supabase status
curl -X GET http://localhost:54321/health

# Check database logs
docker logs postgres
```

### Debug Commands
```bash
# View all service logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f n8n
docker-compose logs -f llm-server

# Check service resources
docker stats

# Access service shell
docker exec -it n8n bash
docker exec -it llm-server bash
```

## Test Data

### Sample Messages
```json
{
  "emergency": "I have severe chest pain",
  "clinical": "My back hurts when I sit",
  "appointment": "I want to book an appointment",
  "billing": "Do you accept Blue Cross insurance?",
  "general": "What are your hours?"
}
```

### Sample Demo Context
```json
{
  "demoId": "bd5aa8b2-84fa-4b64-986d-7458b680b5b9",
  "company_name": "Hassan Spine & Sports Medicine",
  "agent_name": "Olivia",
  "industry": "healthcare",
  "category": "pain_management"
}
```

## Test Reports

### Performance Metrics
- **Response Time:** < 2 seconds
- **Throughput:** > 100 requests/minute
- **Error Rate:** < 1%
- **Uptime:** > 99.9%

### Quality Metrics
- **Intent Classification Accuracy:** > 95%
- **Response Relevance:** > 90%
- **User Satisfaction:** > 4.5/5
- **Booking Completion Rate:** > 80%

## Resources

### Test Files
- **Quick Test:** `scripts/quick-test.sh`
- **Demo Test:** `scripts/test-dr-hassan-demo.sh`
- **Workflow Test:** `scripts/test-workflow.sh`

### Documentation
- **Platform Overview:** `docs/platform-overview.md`
- **Dr. Hassan Implementation:** `docs/dr-hassan-implementation.md`
- **N8N Workflow Guide:** `docs/n8n-workflow-guide.md`

### Test URLs
- **Demo Platform:** `http://localhost:3000`
- **Admin Dashboard:** `http://localhost:3002`
- **N8N Workflow:** `http://localhost:5678`
- **LLM Server:** `http://localhost:8200`

---

*This document consolidates all testing procedures and serves as the single source of truth for testing the platform.* 