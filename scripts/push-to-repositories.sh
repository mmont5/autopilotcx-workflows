#!/bin/bash

# Simple script to push code to existing repositories
# Since N8N is running in Docker, we'll push the code directly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Repository URLs
BACKEND_REPO="https://github.com/mmont5/autopilotcx-backend.git"
CLIENTDEMO_REPO="https://github.com/mmont5/clientdemo.git"
WORKFLOWS_REPO="https://github.com/mmont5/autopilotcx-workflows.git"

# Temporary directories
TEMP_DIR="/tmp/autopilotcx-push"
BACKEND_DIR="$TEMP_DIR/backend"
CLIENTDEMO_DIR="$TEMP_DIR/clientdemo"
WORKFLOWS_DIR="$TEMP_DIR/workflows"

# Cleanup function
cleanup() {
    print_status "Cleaning up temporary directories..."
    rm -rf "$TEMP_DIR"
}

# Setup backend repository
setup_backend() {
    print_status "Setting up backend repository..."
    
    mkdir -p "$BACKEND_DIR"
    cd "$BACKEND_DIR"
    
    # Clone existing repository
    git clone "$BACKEND_REPO" .
    
    # Remove existing files (except .git)
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Copy backend files
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo ./apps/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/admin ./apps/
    
    # Copy N8N services (excluding .n8n directory)
    mkdir -p ./services/n8n
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/nodes ./services/n8n/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/dist ./services/n8n/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/custom-nodes ./services/n8n/
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package.json ./services/n8n/
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package-lock.json ./services/n8n/
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/docker-compose.yml ./services/n8n/
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/Dockerfile ./services/n8n/
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/README.md ./services/n8n/
    
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows ./
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs ./
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/scripts ./
    
    # Copy configuration files
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/package.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/tsconfig.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docker-compose.yml ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/.env.example ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-backend.md ./README.md
    
    # Add and commit
    git add .
    git commit -m "Update backend code - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_success "Backend repository updated"
}

# Setup client demo repository
setup_clientdemo() {
    print_status "Setting up client demo repository..."
    
    mkdir -p "$CLIENTDEMO_DIR"
    cd "$CLIENTDEMO_DIR"
    
    # Clone existing repository
    git clone "$CLIENTDEMO_REPO" .
    
    # Remove existing files (except .git)
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Create directory structure
    mkdir -p src/{components,app,lib,types} public
    
    # Copy client demo files
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/components/* src/components/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/app/* src/app/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/lib/* src/lib/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/types/* src/types/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/public/* public/
    
    # Copy configuration files
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/package.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/tsconfig.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/next.config.js ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/tailwind.config.ts ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-clientdemo.md ./README.md
    
    # Add and commit
    git add .
    git commit -m "Update client demo code - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_success "Client demo repository updated"
}

# Setup workflows repository
setup_workflows() {
    print_status "Setting up workflows repository..."
    
    mkdir -p "$WORKFLOWS_DIR"
    cd "$WORKFLOWS_DIR"
    
    # Clone existing repository
    git clone "$WORKFLOWS_REPO" .
    
    # Remove existing files (except .git)
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Create directory structure
    mkdir -p nodes workflows docs examples
    
    # Copy workflow files
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/nodes/* nodes/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows/* workflows/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs/* docs/
    
    # Copy N8N configuration
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package.json ./
    if [ -f "/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json" ]; then
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json ./
    elif [ -f "/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json.bak" ]; then
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json.bak ./tsconfig.json
    fi
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-workflows.md ./README.md
    
    # Add and commit
    git add .
    git commit -m "Update workflows code - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_success "Workflows repository updated"
}

# Push to repositories
push_repositories() {
    print_status "Pushing to repositories..."
    
    # Push backend
    cd "$BACKEND_DIR"
    git push origin main
    print_success "Backend repository pushed"
    
    # Push client demo
    cd "$CLIENTDEMO_DIR"
    git push origin main
    print_success "Client demo repository pushed"
    
    # Push workflows
    cd "$WORKFLOWS_DIR"
    git push origin main
    print_success "Workflows repository pushed"
}

# Main function
main() {
    print_status "Starting repository push process..."
    
    # Create temporary directory
    mkdir -p "$TEMP_DIR"
    
    # Setup repositories
    setup_backend
    setup_clientdemo
    setup_workflows
    
    # Push to repositories
    push_repositories
    
    # Cleanup
    cleanup
    
    print_success "All repositories updated successfully!"
    print_status "Repositories updated:"
    echo "  - Backend: $BACKEND_REPO"
    echo "  - Client Demo: $CLIENTDEMO_REPO"
    echo "  - Workflows: $WORKFLOWS_REPO"
}

# Trap to cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 