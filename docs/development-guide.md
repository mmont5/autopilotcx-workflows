# Development Guide

**Created:** January 2025  
**Last Updated:** January 2025  
**Status:** Production Ready - All development procedures implemented

## Overview
This document consolidates all development procedures, checklists, and implementation details into a single comprehensive development reference.

## Quick Start Development

### Local Development Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd AutopilotCX-New-June-20-2025

# 2. Install dependencies
pnpm install

# 3. Start all services
docker-compose up -d

# 4. Start frontend applications
cd apps/admin && npm run dev  # localhost:3002
cd apps/client && npm run dev  # localhost:3001
cd apps/demo && npm run dev    # localhost:3000
```

### Service Ports
- **Demo Platform:** `localhost:3000`
- **User Dashboard:** `localhost:3001`
- **Admin Dashboard:** `localhost:3002`
- **API Gateway:** `localhost:8000`
- **LLM Server:** `localhost:8200`
- **N8N Workflow:** `localhost:5678`
- **Supabase:** `localhost:54321`

## Development Checklists

### Backend Development Checklist
- [ ] **API Gateway** - FastAPI service with authentication
- [ ] **LLM Server** - vLLM integration with fallback options
- [ ] **Image Generation** - Stable Diffusion XL service
- [ ] **Video Generation** - Stable Video Diffusion service
- [ ] **CX Symphony Suite** - AI agent orchestration
- [ ] **Workflow Engine** - N8N custom nodes
- [ ] **SEO Services** - Keyword Scout and Hashtag Miner
- [ ] **Analytics** - PostHog integration
- [ ] **Database** - PostgreSQL with pgvector
- [ ] **Caching** - Redis for sessions and queues

### Frontend Development Checklist
- [ ] **Admin Dashboard** - Complete administrative interface
- [ ] **User Dashboard** - Client-facing application
- [ ] **Demo Platform** - Interactive demo system
- [ ] **Design Studio** - Content creation interface
- [ ] **Authentication** - NextAuth.js integration
- [ ] **Real-time Chat** - Socket.io implementation
- [ ] **Analytics Dashboard** - Performance tracking
- [ ] **SEO Content Creation** - Social media automation

### Local Testing Checklist
- [ ] **Service Health Checks** - All services responding
- [ ] **Database Connections** - Supabase integration working
- [ ] **Webhook Configuration** - N8N triggers functioning
- [ ] **LLM Integration** - AI responses generating
- [ ] **Demo Flow** - End-to-end demo testing
- [ ] **Authentication** - Login/logout working
- [ ] **File Uploads** - Document handling functional
- [ ] **Real-time Features** - Chat and notifications working

## Architecture Overview

### Monorepo Structure
```
AutopilotCX/
├── apps/                    # Frontend applications
│   ├── admin/              # Owner/Admin dashboard
│   ├── client/             # User dashboard
│   ├── demo/               # Demo platform
│   └── marketplace/        # NFT marketplace
├── services/               # Backend microservices
│   ├── api-gateway/        # API Gateway
│   ├── orchestrator/       # AI Orchestration
│   ├── llm-server/         # LLM Service
│   ├── cx-symphony/        # CX Symphony Suite
│   └── [40+ other services]
├── libs/                   # Shared libraries
├── docs/                   # Documentation
├── infra/                  # Infrastructure
└── scripts/                # Build scripts
```

### Technology Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Python, FastAPI, Express.js
- **Database:** PostgreSQL, Redis, Supabase
- **AI/ML:** vLLM, Stable Diffusion, Transformers
- **Workflow:** N8N, Custom Nodes
- **Deployment:** Docker, Kubernetes, Vercel, Render

## Development Workflow

### Feature Development
1. **Create Feature Branch** - `git checkout -b feature/feature-name`
2. **Develop Feature** - Implement in appropriate service/app
3. **Test Locally** - Run comprehensive tests
4. **Update Documentation** - Add to relevant guides
5. **Create Pull Request** - Submit for review
6. **Deploy to Staging** - Test in staging environment
7. **Deploy to Production** - Release to production

### Testing Strategy
- **Unit Tests** - Individual component testing
- **Integration Tests** - Service-to-service testing
- **End-to-End Tests** - Complete user journey testing
- **Performance Tests** - Load and stress testing
- **Security Tests** - Vulnerability assessment

### Code Quality Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Code linting and formatting
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks
- **Jest** - Unit and integration testing

## Development Tools

### Essential Tools
- **Docker** - Containerization and deployment
- **pnpm** - Package management
- **VS Code** - Development environment
- **Postman** - API testing
- **N8N** - Workflow testing
- **Supabase CLI** - Database management

### Development Scripts
```bash
# Start all services
npm run dev

# Start specific service
npm run dev:admin
npm run dev:client
npm run dev:demo

# Run tests
npm run test
npm run test:unit
npm run test:integration

# Build for production
npm run build
npm run build:admin
npm run build:client
npm run build:demo
```

## Common Development Tasks

### Adding New Service
1. **Create Service Directory** - `services/new-service/`
2. **Add Docker Configuration** - `Dockerfile` and `docker-compose.yml`
3. **Implement Service Logic** - Main application code
4. **Add Health Checks** - `/health` endpoint
5. **Update API Gateway** - Add routing configuration
6. **Add Tests** - Unit and integration tests
7. **Update Documentation** - Add to relevant guides

### Adding New Frontend Page
1. **Create Page Component** - `apps/admin/src/app/page-name/`
2. **Add Routing** - Update navigation and routing
3. **Implement API Calls** - Connect to backend services
4. **Add State Management** - Context or Redux
5. **Add Tests** - Component and integration tests
6. **Update Documentation** - Add to user guides

### Database Schema Changes
1. **Create Migration** - Supabase migration file
2. **Update Types** - TypeScript type definitions
3. **Update API** - Backend API changes
4. **Update Frontend** - Frontend component changes
5. **Test Migration** - Verify data integrity
6. **Deploy Migration** - Apply to production

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check Docker logs
docker-compose logs service-name

# Rebuild container
docker-compose build service-name --no-cache
docker-compose up -d service-name

# Check environment variables
docker-compose config
```

#### Database Connection Issues
```bash
# Check Supabase status
supabase status

# Reset local database
supabase db reset

# Check connection
supabase db ping
```

#### Frontend Build Issues
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
pnpm install

# Check TypeScript errors
npx tsc --noEmit
```

#### N8N Workflow Issues
```bash
# Check N8N logs
docker-compose logs n8n

# Restart N8N
docker-compose restart n8n

# Check webhook endpoints
curl http://localhost:5678/api/v1/webhooks
```

### Debug Commands
```bash
# Check all service status
docker-compose ps

# View all logs
docker-compose logs -f

# Check resource usage
docker stats

# Access service shell
docker exec -it service-name bash
```

## Performance Optimization

### Frontend Optimization
- **Code Splitting** - Lazy load components
- **Image Optimization** - Next.js Image component
- **Caching** - Redis for session data
- **CDN** - Static asset delivery
- **Bundle Analysis** - Webpack bundle analyzer

### Backend Optimization
- **Database Indexing** - Optimize query performance
- **Caching Strategy** - Redis for frequently accessed data
- **Connection Pooling** - Database connection management
- **Load Balancing** - Distribute traffic across instances
- **Monitoring** - Performance metrics and alerts

### AI Service Optimization
- **GPU Utilization** - Optimize CUDA usage
- **Model Caching** - Cache model weights
- **Batch Processing** - Process multiple requests
- **Response Streaming** - Real-time response generation
- **Fallback Strategies** - Multiple AI service options

## Security Considerations

### Authentication & Authorization
- **JWT Tokens** - Secure token-based authentication
- **Role-Based Access** - Granular permission system
- **Session Management** - Secure session handling
- **API Rate Limiting** - Prevent abuse and attacks

### Data Protection
- **Encryption** - Data encryption at rest and in transit
- **HIPAA Compliance** - Healthcare data protection
- **GDPR Compliance** - European privacy regulations
- **Audit Logging** - Comprehensive activity tracking

### Infrastructure Security
- **Container Security** - Docker security best practices
- **Network Security** - Firewall and network isolation
- **Secret Management** - Secure credential storage
- **Vulnerability Scanning** - Regular security assessments

## Deployment Strategy

### Environment Management
- **Development** - Local development environment
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

### CI/CD Pipeline
- **GitHub Actions** - Automated testing and deployment
- **Docker Images** - Containerized application deployment
- **Kubernetes** - Orchestrated container deployment
- **Monitoring** - Application performance monitoring

### Rollback Strategy
- **Database Migrations** - Version-controlled schema changes
- **Application Rollback** - Quick service rollback
- **Infrastructure Rollback** - Infrastructure as Code rollback
- **Monitoring** - Real-time deployment monitoring

## Resources

### Documentation
- **Platform Overview:** `docs/platform-overview.md`
- **Features Guide:** `docs/features-guide.md`
- **Testing Guide:** `docs/testing-guide.md`
- **N8N Workflow Guide:** `docs/n8n-workflow-guide.md`

### Development Tools
- **VS Code Extensions:** TypeScript, Docker, GitLens
- **Browser Extensions:** React DevTools, Redux DevTools
- **API Testing:** Postman, Insomnia
- **Database Tools:** Supabase Studio, pgAdmin

### Community Resources
- **Next.js Documentation:** https://nextjs.org/docs
- **Docker Documentation:** https://docs.docker.com/
- **N8N Documentation:** https://docs.n8n.io/
- **Supabase Documentation:** https://supabase.com/docs

---

*This document consolidates all development procedures and serves as the single source of truth for development workflows.* 