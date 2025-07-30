# AutopilotCX Workflows

A collection of N8N workflow templates and custom nodes for creating hyper-personalized AI agents across multiple industries.

## 🚀 Overview

This repository contains the workflow engine components of the AutopilotCX platform, including:

- **Custom N8N Nodes** - Specialized nodes for different industries
- **Workflow Templates** - Pre-built workflows for common use cases
- **Industry-Specific Configurations** - Healthcare, Legal, Real Estate, E-commerce
- **Documentation** - Comprehensive guides and examples

## 🛠️ Tech Stack

- **Workflow Engine:** N8N (Node.js-based)
- **Custom Nodes:** TypeScript/JavaScript
- **Database:** Supabase (PostgreSQL)
- **API Integration:** REST APIs, Webhooks
- **Deployment:** Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- N8N instance (local or cloud)
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mmont5/autopilotcx-workflows.git
cd autopilotcx-workflows
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:

```env
# N8N Configuration
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# External APIs
GOOGLE_PLACES_API_KEY=your_google_places_key
OPENAI_API_KEY=your_openai_key
```

### 4. Start N8N with Custom Nodes

```bash
# Start N8N with custom nodes
docker-compose up -d

# Or start manually
n8n start
```

Access N8N at [http://localhost:5678](http://localhost:5678)

## 📁 Project Structure

```
nodes/                    # Custom N8N nodes
├── BookingAgent.node.ts  # Appointment booking logic
├── MaestroAgent.node.ts  # Clinical consultation
├── HarmonyAgent.node.ts  # General inquiries
└── index.ts             # Node exports

workflows/                # N8N workflow templates
├── healthcare/          # Healthcare-specific workflows
├── legal/              # Legal industry workflows
├── real-estate/        # Real estate workflows
└── ecommerce/          # E-commerce workflows

docs/                    # Documentation
├── nodes/              # Node documentation
├── workflows/          # Workflow guides
└── examples/           # Usage examples

examples/                # Example implementations
├── basic-chat/         # Basic chat workflow
├── appointment-booking/ # Booking system
└── multi-agent/        # Multi-agent setup
```

## 🎯 Custom Nodes

### BookingAgent Node

**Purpose:** Handles appointment booking and scheduling logic

**Features:**
- Multi-step booking flow
- Date/time validation
- Location selection
- Insurance verification
- Summary generation

**Usage:**
```javascript
// Node configuration
{
  "name": "BookingAgent",
  "type": "n8n-nodes-base.bookingAgent",
  "parameters": {
    "demoId": "{{ $json.demoId }}",
    "bookingState": "{{ $json.bookingState }}",
    "bookingData": "{{ $json.bookingData }}"
  }
}
```

### MaestroAgent Node

**Purpose:** Handles clinical consultations and medical inquiries

**Features:**
- Symptom assessment
- Pain level evaluation
- Treatment recommendations
- Emergency detection
- Professional consultation

**Usage:**
```javascript
// Node configuration
{
  "name": "MaestroAgent",
  "type": "n8n-nodes-base.maestroAgent",
  "parameters": {
    "industry": "healthcare",
    "specialty": "{{ $json.specialty }}",
    "symptoms": "{{ $json.symptoms }}"
  }
}
```

### HarmonyAgent Node

**Purpose:** General inquiries and customer service

**Features:**
- FAQ handling
- General information
- Contact details
- Service inquiries
- Multi-language support

## 🔧 Development

### Creating Custom Nodes

1. **Create Node File**
```typescript
// nodes/YourNode.node.ts
import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';

export class YourNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Your Node',
    name: 'yourNode',
    group: ['transform'],
    version: 1,
    description: 'Your custom node description',
    defaults: {
      name: 'Your Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Define your node properties
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Your node logic here
  }
}
```

2. **Compile TypeScript**
```bash
# Compile node
npx tsc nodes/YourNode.node.ts --outDir dist --target ES2018 --module commonjs
```

3. **Register with N8N**
```bash
# Copy compiled node to N8N custom nodes directory
cp dist/YourNode.node.js /path/to/n8n/custom/
```

### Testing Nodes

```bash
# Run node tests
npm test

# Test specific node
npm test -- --grep "BookingAgent"

# Run with coverage
npm run test:coverage
```

### Workflow Development

1. **Create Workflow Template**
```json
{
  "name": "Healthcare Demo Workflow",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "healthcare-demo"
      }
    },
    {
      "name": "BookingAgent",
      "type": "n8n-nodes-base.bookingAgent",
      "parameters": {
        "demoId": "{{ $json.demoId }}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [["BookingAgent"]]
    }
  }
}
```

2. **Import to N8N**
- Save workflow as JSON file
- Import via N8N UI or API
- Activate workflow for production

## 🚀 Deployment

### Docker Deployment

```bash
# Build custom N8N image
docker build -t autopilotcx-n8n .

# Run with custom nodes
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  autopilotcx-n8n
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  n8n:
    build: .
    ports:
      - "5678:5678"
    environment:
      - N8N_BASE_URL=http://localhost:5678
      - N8N_WEBHOOK_URL=http://localhost:5678/webhook
    volumes:
      - n8n_data:/home/node/.n8n
      - ./nodes:/custom-nodes

volumes:
  n8n_data:
```

### Cloud Deployment

```bash
# Deploy to cloud platform
n8n deploy --target cloud

# Or use platform-specific deployment
# AWS, Google Cloud, Azure, etc.
```

## 📊 Monitoring

### Workflow Execution

```bash
# View execution logs
docker logs n8n

# Monitor specific workflow
n8n workflow:list
n8n workflow:execute --id <workflow-id>
```

### Performance Metrics

- **Execution Time:** Track workflow performance
- **Success Rate:** Monitor error rates
- **Resource Usage:** CPU and memory usage
- **API Calls:** External service integration

## 🔒 Security

### Node Security

```typescript
// Validate input data
const validateInput = (data: any): boolean => {
  return data && typeof data === 'object' && data.message;
};

// Sanitize output
const sanitizeOutput = (data: any): any => {
  return {
    ...data,
    sensitive: undefined // Remove sensitive data
  };
};
```

### API Security

```typescript
// Authenticate API calls
const authenticateRequest = (headers: any): boolean => {
  const apiKey = headers['x-api-key'];
  return apiKey === process.env.API_KEY;
};
```

## 🧪 Testing

### Node Testing

```typescript
// Test node execution
describe('BookingAgent Node', () => {
  it('should process booking request', async () => {
    const node = new BookingAgent();
    const result = await node.execute(mockExecuteFunctions);
    expect(result).toBeDefined();
  });
});
```

### Workflow Testing

```bash
# Test workflow execution
n8n workflow:test --file workflow.json

# Test with sample data
n8n workflow:test --file workflow.json --input sample-data.json
```

## 📚 Documentation

### Node Documentation

Each custom node includes:
- **Purpose and functionality**
- **Input/output parameters**
- **Configuration options**
- **Usage examples**
- **Error handling**

### Workflow Documentation

Workflow templates include:
- **Setup instructions**
- **Configuration guide**
- **Usage examples**
- **Troubleshooting tips**

## 🔗 Integration

### Supabase Integration

```typescript
// Connect to Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### External APIs

```typescript
// Google Places API
const getBusinessHours = async (placeId: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.GOOGLE_PLACES_API_KEY}`
  );
  return response.json();
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Node Not Loading**
   - Check TypeScript compilation
   - Verify node registration
   - Restart N8N instance

2. **Workflow Execution Errors**
   - Check node configuration
   - Verify input data format
   - Review execution logs

3. **API Connection Issues**
   - Verify API keys
   - Check network connectivity
   - Review rate limits

### Debug Mode

```bash
# Enable debug logging
DEBUG=n8n:* n8n start

# Or set environment variable
N8N_LOG_LEVEL=debug n8n start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your custom node or workflow
4. Write tests for your code
5. Submit a pull request

### Development Guidelines

- **Node Development:** Follow N8N node patterns
- **Workflow Design:** Use best practices for workflow structure
- **Documentation:** Include comprehensive documentation
- **Testing:** Write tests for all new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/mmont5/autopilotcx-workflows/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mmont5/autopilotcx-workflows/discussions)

## 🔗 Related Projects

- **[AutopilotCX Backend](https://github.com/mmont5/autopilotcx-backend)** - Backend services and API
- **[Client Demo](https://github.com/mmont5/clientdemo)** - Frontend chat interface

## 📈 Roadmap

### Planned Features

- **More Industry Templates** - Additional industry workflows
- **Advanced AI Integration** - Enhanced AI capabilities
- **Multi-Language Support** - Internationalization
- **Advanced Analytics** - Detailed workflow analytics
- **Mobile App Support** - Native mobile applications

### Community Contributions

- **Custom Nodes** - Community-developed nodes
- **Workflow Templates** - User-contributed workflows
- **Documentation** - Community-written guides
- **Examples** - Real-world use cases

---

**Built with ❤️ by the AutopilotCX Team** 