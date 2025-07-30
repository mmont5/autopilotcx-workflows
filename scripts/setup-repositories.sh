#!/bin/bash

# AutopilotCX Repository Setup Script
# This script organizes the codebase into repository-specific structures

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025"
BACKEND_DIR="$PROJECT_ROOT/repositories/backend"
CLIENTDEMO_DIR="$PROJECT_ROOT/repositories/clientdemo"
WORKFLOWS_DIR="$PROJECT_ROOT/repositories/workflows"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to create directory structure
create_directory_structure() {
    print_status "Creating repository directory structure..."
    
    # Create main repositories directory
    mkdir -p "$PROJECT_ROOT/repositories"
    
    # Create backend structure
    mkdir -p "$BACKEND_DIR"/{apps/{demo,admin},services/n8n,workflows,docs,scripts}
    
    # Create client demo structure
    mkdir -p "$CLIENTDEMO_DIR"/{src/{components,app,lib,types},public}
    
    # Create workflows structure
    mkdir -p "$WORKFLOWS_DIR"/{nodes,workflows,docs,examples}
    
    print_success "Directory structure created"
}

# Function to copy backend files
copy_backend_files() {
    print_status "Copying backend files..."
    
    # Copy apps
    cp -r "$PROJECT_ROOT/apps/demo" "$BACKEND_DIR/apps/"
    cp -r "$PROJECT_ROOT/apps/admin" "$BACKEND_DIR/apps/"
    
    # Copy services
    cp -r "$PROJECT_ROOT/services/n8n" "$BACKEND_DIR/services/"
    
    # Copy workflows
    cp -r "$PROJECT_ROOT/workflows" "$BACKEND_DIR/"
    
    # Copy docs
    cp -r "$PROJECT_ROOT/docs" "$BACKEND_DIR/"
    
    # Copy scripts
    cp -r "$PROJECT_ROOT/scripts" "$BACKEND_DIR/"
    
    # Copy configuration files
    cp "$PROJECT_ROOT/package.json" "$BACKEND_DIR/"
    cp "$PROJECT_ROOT/tsconfig.json" "$BACKEND_DIR/"
    cp "$PROJECT_ROOT/docker-compose.yml" "$BACKEND_DIR/"
    cp "$PROJECT_ROOT/.env.example" "$BACKEND_DIR/"
    
    # Copy README
    cp "$PROJECT_ROOT/README-backend.md" "$BACKEND_DIR/README.md"
    
    print_success "Backend files copied"
}

# Function to copy client demo files
copy_clientdemo_files() {
    print_status "Copying client demo files..."
    
    # Copy components
    cp -r "$PROJECT_ROOT/apps/demo/components" "$CLIENTDEMO_DIR/src/"
    
    # Copy app structure
    cp -r "$PROJECT_ROOT/apps/demo/app" "$CLIENTDEMO_DIR/src/"
    
    # Copy lib
    cp -r "$PROJECT_ROOT/apps/demo/lib" "$CLIENTDEMO_DIR/src/"
    
    # Copy types
    cp -r "$PROJECT_ROOT/apps/demo/types" "$CLIENTDEMO_DIR/src/"
    
    # Copy public assets
    cp -r "$PROJECT_ROOT/apps/demo/public" "$CLIENTDEMO_DIR/"
    
    # Copy configuration files
    cp "$PROJECT_ROOT/apps/demo/package.json" "$CLIENTDEMO_DIR/"
    cp "$PROJECT_ROOT/apps/demo/tsconfig.json" "$CLIENTDEMO_DIR/"
    cp "$PROJECT_ROOT/apps/demo/next.config.js" "$CLIENTDEMO_DIR/"
    cp "$PROJECT_ROOT/apps/demo/tailwind.config.js" "$CLIENTDEMO_DIR/"
    cp "$PROJECT_ROOT/apps/demo/postcss.config.js" "$CLIENTDEMO_DIR/"
    
    # Copy README
    cp "$PROJECT_ROOT/README-clientdemo.md" "$CLIENTDEMO_DIR/README.md"
    
    print_success "Client demo files copied"
}

# Function to copy workflows files
copy_workflows_files() {
    print_status "Copying workflows files..."
    
    # Copy nodes
    cp -r "$PROJECT_ROOT/services/n8n/nodes" "$WORKFLOWS_DIR/"
    
    # Copy workflows
    cp -r "$PROJECT_ROOT/workflows" "$WORKFLOWS_DIR/"
    
    # Copy docs
    cp -r "$PROJECT_ROOT/docs" "$WORKFLOWS_DIR/"
    
    # Copy N8N configuration
    cp "$PROJECT_ROOT/services/n8n/package.json" "$WORKFLOWS_DIR/"
    cp "$PROJECT_ROOT/services/n8n/tsconfig.json" "$WORKFLOWS_DIR/"
    
    # Copy README
    cp "$PROJECT_ROOT/README-workflows.md" "$WORKFLOWS_DIR/README.md"
    
    print_success "Workflows files copied"
}

# Function to initialize git repositories
initialize_git_repositories() {
    print_status "Initializing Git repositories..."
    
    # Initialize backend repository
    cd "$BACKEND_DIR"
    git init
    git remote add origin https://github.com/mmont5/autopilotcx-backend.git
    git add .
    git commit -m "Initial backend repository setup"
    print_success "Backend repository initialized"
    
    # Initialize client demo repository
    cd "$CLIENTDEMO_DIR"
    git init
    git remote add origin https://github.com/mmont5/clientdemo.git
    git add .
    git commit -m "Initial client demo repository setup"
    print_success "Client demo repository initialized"
    
    # Initialize workflows repository
    cd "$WORKFLOWS_DIR"
    git init
    git remote add origin https://github.com/mmont5/autopilotcx-workflows.git
    git add .
    git commit -m "Initial workflows repository setup"
    print_success "Workflows repository initialized"
}

# Function to create .gitignore files
create_gitignore_files() {
    print_status "Creating .gitignore files..."
    
    # Backend .gitignore
    cat > "$BACKEND_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
.next/
out/
dist/
build/

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

    # Client demo .gitignore
    cat > "$CLIENTDEMO_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/

# Production
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/

# OS
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

    # Workflows .gitignore
    cat > "$WORKFLOWS_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local

# Logs
*.log

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# N8N specific
.n8n/
*.node.js
EOF

    print_success ".gitignore files created"
}

# Function to create package.json files
create_package_json_files() {
    print_status "Creating package.json files..."
    
    # Backend package.json
    cat > "$BACKEND_DIR/package.json" << 'EOF'
{
  "name": "autopilotcx-backend",
  "version": "1.0.0",
  "description": "AutopilotCX Backend - Full-stack application for creating hyper-personalized AI agents",
  "main": "index.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:admin\" \"npm run dev:demo\" \"npm run dev:n8n\"",
    "dev:admin": "cd apps/admin && npm run dev",
    "dev:demo": "cd apps/demo && npm run dev",
    "dev:n8n": "cd services/n8n && npm run dev",
    "build": "npm run build:admin && npm run build:demo",
    "build:admin": "cd apps/admin && npm run build",
    "build:demo": "cd apps/demo && npm run build",
    "test": "npm run test:admin && npm run test:demo",
    "test:admin": "cd apps/admin && npm test",
    "test:demo": "cd apps/demo && npm test",
    "lint": "npm run lint:admin && npm run lint:demo",
    "lint:admin": "cd apps/admin && npm run lint",
    "lint:demo": "cd apps/demo && npm run lint",
    "deploy": "./scripts/deploy-to-repositories.sh"
  },
  "keywords": [
    "autopilotcx",
    "ai",
    "chatbot",
    "workflow",
    "n8n",
    "nextjs",
    "typescript"
  ],
  "author": "AutopilotCX Team",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

    # Client demo package.json
    cat > "$CLIENTDEMO_DIR/package.json" << 'EOF'
{
  "name": "autopilotcx-clientdemo",
  "version": "1.0.0",
  "description": "AutopilotCX Client Demo - Modern chat interface for AI agents",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2.38.4",
    "lucide-react": "^0.294.0",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.5"
  },
  "keywords": [
    "autopilotcx",
    "chat",
    "ai",
    "nextjs",
    "typescript",
    "tailwindcss"
  ],
  "author": "AutopilotCX Team",
  "license": "MIT"
}
EOF

    # Workflows package.json
    cat > "$WORKFLOWS_DIR/package.json" << 'EOF'
{
  "name": "autopilotcx-workflows",
  "version": "1.0.0",
  "description": "AutopilotCX Workflows - N8N custom nodes and workflow templates",
  "main": "index.js",
  "scripts": {
    "build": "npx tsc nodes/*.node.ts --outDir dist --target ES2018 --module commonjs",
    "build:watch": "npx tsc nodes/*.node.ts --outDir dist --target ES2018 --module commonjs --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint nodes/*.ts",
    "lint:fix": "eslint nodes/*.ts --fix",
    "deploy": "npm run build && docker-compose up -d --build"
  },
  "keywords": [
    "autopilotcx",
    "n8n",
    "workflow",
    "automation",
    "ai",
    "chatbot"
  ],
  "author": "AutopilotCX Team",
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  },
  "dependencies": {
    "n8n-workflow": "^1.0.0",
    "@supabase/supabase-js": "^2.38.4"
  }
}
EOF

    print_success "package.json files created"
}

# Function to create deployment instructions
create_deployment_instructions() {
    print_status "Creating deployment instructions..."
    
    # Backend deployment instructions
    cat > "$BACKEND_DIR/DEPLOYMENT.md" << 'EOF'
# Deployment Instructions

## Manual Deployment

1. **Push to Backend Repository**
   ```bash
   cd repositories/backend
   git add .
   git commit -m "Update backend code"
   git push origin main
   ```

2. **Deploy with Script**
   ```bash
   ./scripts/deploy-to-repositories.sh
   ```

3. **GitHub Actions**
   - Push to main branch triggers automatic deployment
   - Use GitHub Actions workflow for automated deployment

## Environment Setup

1. **Install Dependencies**
   ```bash
   npm install
   cd apps/admin && npm install
   cd ../demo && npm install
   cd ../../services/n8n && npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Database Setup**
   ```bash
   npx supabase db push
   ```

## Docker Deployment

```bash
docker-compose up -d --build
```

## Monitoring

- Check logs: `docker-compose logs -f`
- Monitor services: `docker-compose ps`
- Restart services: `docker-compose restart`
EOF

    # Client demo deployment instructions
    cat > "$CLIENTDEMO_DIR/DEPLOYMENT.md" << 'EOF'
# Deployment Instructions

## Manual Deployment

1. **Push to Client Demo Repository**
   ```bash
   cd repositories/clientdemo
   git add .
   git commit -m "Update client demo"
   git push origin main
   ```

2. **Vercel Deployment**
   ```bash
   npm i -g vercel
   vercel
   ```

## Environment Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

## Production Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## Docker Deployment

```bash
docker build -t clientdemo .
docker run -p 3000:3000 clientdemo
```
EOF

    # Workflows deployment instructions
    cat > "$WORKFLOWS_DIR/DEPLOYMENT.md" << 'EOF'
# Deployment Instructions

## Manual Deployment

1. **Push to Workflows Repository**
   ```bash
   cd repositories/workflows
   git add .
   git commit -m "Update workflows"
   git push origin main
   ```

2. **Compile Nodes**
   ```bash
   npm run build
   ```

## Environment Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile TypeScript Nodes**
   ```bash
   npm run build
   ```

3. **Start N8N**
   ```bash
   docker-compose up -d
   ```

## Docker Deployment

1. **Build Custom N8N Image**
   ```bash
   docker build -t autopilotcx-n8n .
   ```

2. **Run with Custom Nodes**
   ```bash
   docker run -d \
     --name n8n \
     -p 5678:5678 \
     -v n8n_data:/home/node/.n8n \
     autopilotcx-n8n
   ```

## N8N Integration

1. **Copy Custom Nodes**
   ```bash
   cp dist/*.node.js /path/to/n8n/custom/
   ```

2. **Restart N8N**
   ```bash
   docker-compose restart n8n
   ```

3. **Import Workflows**
   - Use N8N UI to import workflow JSON files
   - Or use N8N API to import workflows programmatically
EOF

    print_success "Deployment instructions created"
}

# Main setup function
main() {
    print_status "Starting AutopilotCX repository setup..."
    
    # Check if project root exists
    if [ ! -d "$PROJECT_ROOT" ]; then
        print_error "Project root directory not found: $PROJECT_ROOT"
        exit 1
    fi
    
    # Create directory structure
    create_directory_structure
    
    # Copy files to repositories
    copy_backend_files
    copy_clientdemo_files
    copy_workflows_files
    
    # Create configuration files
    create_gitignore_files
    create_package_json_files
    create_deployment_instructions
    
    # Initialize git repositories
    initialize_git_repositories
    
    print_success "Repository setup completed successfully!"
    print_status "Repository locations:"
    echo "  - Backend: $BACKEND_DIR"
    echo "  - Client Demo: $CLIENTDEMO_DIR"
    echo "  - Workflows: $WORKFLOWS_DIR"
    echo ""
    print_status "Next steps:"
    echo "  1. Review the repository structures"
    echo "  2. Push to GitHub repositories"
    echo "  3. Set up CI/CD pipelines"
    echo "  4. Configure deployment environments"
}

# Run main function
main "$@" 