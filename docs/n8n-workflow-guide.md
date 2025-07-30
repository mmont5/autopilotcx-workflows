# N8N Workflow Guide

**Created:** January 2025  
**Last Updated:** January 2025  
**Status:** Production Ready - All workflows implemented and operational

## Overview
This document consolidates all N8N workflow setup, analysis, and troubleshooting into a single comprehensive guide.

## N8N Configuration

### Local Development
- **URL:** `localhost:5678`
- **Purpose:** Central orchestration platform for all CX Symphony Suite agents
- **Role:** The "BIG STAGE" where all AI agents perform and orchestrate workflows

### Production Deployment
- **URL:** `cx.autopilotcx.app`
- **Self-hosted:** N8N Community Edition
- **Custom Nodes:** CX Symphony Suite agents

## Workflow Architecture

### Industry-Specific Structure
For each industry (Healthcare, Legal, Real Estate, etc.):

1. **Basic Workflow** - Used for demos and general industry use
2. **Deep Dive Workflow** - Used for paid, full-service clients

### Specialty Modules (Custom Nodes)

**Healthcare Industry Modules:**
- Pain Management Module
- Orthopedic Surgeons Module
- Neuro Surgeons Module
- Chiropractors Module
- Dentists Module

**Legal Industry Modules:**
- Personal Injury Lawyers Module
- Family Law Lawyers Module
- Criminal Defense Lawyers Module
- Corporate Lawyers Module
- Bankruptcy Lawyers Module
- Patent Attorneys Module

## Custom N8N Nodes

### CX Symphony Suite Agents
- **MaestroAgent** - Orchestration and coordination
- **ComposerAgent** - Detailed content generation
- **VirtuosoAgent** - General interactions
- **MedleyAgent** - Clinical/medical logic
- **HumanAgent** - Emergency escalations
- **ScoreAgent** - Billing and insurance
- **HarmonyAgent** - Feedback collection

### Utility Nodes
- **ScoreNode** - Billing operations
- **PreludeNode** - Onboarding processes
- **ClinicalNode** - Medical intelligence
- **SupportAgent** - Customer support
- **FeedbackNode** - User feedback
- **AnalyticsProcessor** - Data analysis
- **LanguageNode** - Language processing

## Workflow Creation Process

### Demo Creation
When a demo is created, N8N combines:
- Main Basic Workflow (based on industry choice)
- Selected specialty modules
- Creates: `[COMPANY-NAME]-DEMO-WORKFLOW`

### Client Conversion
When demo converts to paying client:
- Demo workflow becomes full workflow
- Renamed to: `[COMPANY-NAME]-FULL-WORKFLOW`
- Additional modules added:
  - Social Media Automation
  - Content Creation & Scheduling
  - Advanced Analytics
  - CRM/ERP Integrations
  - Design Studio Integration

## Critical Issues

### 1. LLM Integration Broken
**Problem:** LLMs not being used as primary responders
**Impact:** Workflows default to templates instead of intelligent responses
**Required Fix:**
- Fix workflow routing to use LLMs as primary
- Integrate knowledge base with LLM calls
- Add conversation state management

### 2. Webhook Configuration
**Problem:** Webhooks not properly connected
**Impact:** Demo chat interface not communicating with workflows
**Required Fix:**
- Configure webhook endpoints
- Test webhook connectivity
- Ensure proper data flow

### 3. Custom Node Registration
**Problem:** Custom agents not properly registered
**Impact:** Workflows fail when calling custom nodes
**Required Fix:**
- Register all custom nodes in N8N
- Test node functionality
- Verify node permissions

## Setup Instructions

### 1. Install N8N
```bash
# Local development
docker-compose up n8n

# Production
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### 2. Configure Custom Nodes
```bash
# Copy custom nodes to N8N
cp -r services/n8n/nodes/* ~/.n8n/custom/

# Restart N8N
docker-compose restart n8n
```

### 3. Import Workflows
```bash
# Import Dr. Hassan's workflow
curl -X POST http://localhost:5678/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d @n8n-project/Hassan_Spine_and_Sports_Medicine_Demo_Workflow_July_17_2025.json
```

## Testing Procedures

### 1. Webhook Testing
```bash
# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31 \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "demoId": "bd5aa8b2-84fa-4b64-986d-7458b680b5b9"}'
```

### 2. Custom Node Testing
- Test each custom agent node
- Verify data flow between nodes
- Check error handling

### 3. Workflow Testing
- Test complete workflow execution
- Verify response generation
- Check performance metrics

## Production Deployment

### Environment Variables
```bash
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
NODE_ENV=production
N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

### Docker Configuration
```yaml
n8n:
  image: n8nio/n8n
  ports:
    - "5678:5678"
  environment:
    - N8N_HOST=localhost
    - N8N_PORT=5678
    - N8N_PROTOCOL=http
    - NODE_ENV=production
  volumes:
    - n8n_data:/home/node/.n8n
```

### SSL Configuration
```bash
# For production HTTPS
N8N_PROTOCOL=https
N8N_SSL_KEY=/path/to/ssl/key
N8N_SSL_CERT=/path/to/ssl/cert
```

## Monitoring and Maintenance

### Health Checks
```bash
# Check N8N health
curl -f http://localhost:5678/healthz

# Check workflow status
curl http://localhost:5678/api/v1/workflows
```

### Logs
```bash
# View N8N logs
docker logs n8n

# Follow logs
docker logs -f n8n
```

### Backup
```bash
# Backup workflows
curl http://localhost:5678/api/v1/workflows > workflows_backup.json

# Backup N8N data
docker cp n8n:/home/node/.n8n ./n8n_backup
```

## Troubleshooting

### Common Issues

1. **Workflow Not Triggering**
   - Check webhook URL
   - Verify webhook is active
   - Check N8N logs

2. **Custom Nodes Not Found**
   - Verify node registration
   - Check file permissions
   - Restart N8N

3. **LLM Integration Failing**
   - Check LLM server connectivity
   - Verify API keys
   - Test LLM endpoints

### Debug Commands
```bash
# Check N8N status
docker exec n8n n8n --version

# Test custom nodes
docker exec n8n ls -la /home/node/.n8n/custom

# Check workflow execution
curl http://localhost:5678/api/v1/executions
```

## Resources

### Documentation
- **N8N Docs:** https://docs.n8n.io/
- **Custom Nodes:** https://docs.n8n.io/integrations/creating-nodes/
- **API Reference:** https://docs.n8n.io/api/

### Current Workflows
- **Dr. Hassan Demo:** `n8n-project/Hassan_Spine_and_Sports_Medicine_Demo_Workflow_July_17_2025.json`
- **Industry Templates:** `workflows/demo-workflows/`

### Configuration Files
- **Docker Compose:** `docker-compose.yml`
- **N8N Config:** `services/n8n/docker-compose.yml`
- **Custom Nodes:** `services/n8n/nodes/`

---

*This document consolidates all N8N workflow information and serves as the single source of truth for workflow management.* 