# N8N AutopilotCX Workflow Engine

Official N8N deployment for AutopilotCX platform - native nodes only approach for maximum scalability.

## Architecture

- **Official N8N Image**: Uses n8nio/n8n:latest for stability
- **PostgreSQL**: Persistent workflow and execution storage
- **Native Nodes Only**: No custom compilation needed
- **Modular Workflows**: Basic templates + industry-specific modules

## Deployment

### Local Development
```bash
docker-compose up -d
```

### Render Production
- Automatically deploys to: https://cx.autopilotcx.app
- Connected to PostgreSQL database
- Environment variables managed via Render dashboard

## Workflow Structure

### Healthcare Demo Workflows
- `Healthcare-Demo-Worklfow-September-2-2025.json` - Latest healthcare workflow
- `demo-workflows/` - Industry-specific demo templates
- `templates/` - Reusable workflow modules

### Key Features
- **State Management**: Complete conversation state tracking
- **Claude Flow Integration**: AI-powered chat intelligence
- **OpenRouter API**: Multiple AI model support
- **Demo Context**: Hyper-personalized client demos
- **Modular Design**: Basic workflow + specialty modules

## Configuration

### Required Environment Variables
```bash
# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres
DB_POSTGRESDB_DATABASE=n8n_autopilotcx

# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_password

# URLs
WEBHOOK_URL=https://cx.autopilotcx.app
N8N_HOST=cx.autopilotcx.app

# AI Integration
OPENROUTER_API_KEY=your_openrouter_key
ANTHROPIC_API_KEY=your_anthropic_key

# AutopilotCX Integration
AUTOPILOTCX_ADMIN_URL=https://app.autopilotcx.app
AUTOPILOTCX_DEMO_URL=https://clientdemo.me
```

## Workflow Templates

### Master Templates
- Healthcare Basic Workflow
- Real Estate Basic Workflow
- Legal Services Basic Workflow

### Modules (Add-ons)
- Pain Management Module
- Orthopedic Surgery Module
- Social Media Automation Module
- Analytics & Reporting Module
- EHR Integration Module

## Usage

1. **Demo Creation**: Admin creates demo → triggers N8N workflow
2. **Chat Processing**: Demo chat → Claude Flow → N8N orchestration
3. **Modular Assembly**: Basic workflow + selected modules = client workflow
4. **Conversion**: Demo workflow → Full client workflow (upon payment)

## Dr. Hassan Demo Status

✅ **Fully Operational** via Claude Flow integration
- Complete 11-step healthcare booking flow
- Hyper-personalized for spine & sports medicine
- State management with conversation context
- Real-time appointment scheduling