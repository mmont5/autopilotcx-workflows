#!/bin/bash

# AutopilotCX Repository Deployment Script
# This script deploys the codebase to three separate GitHub repositories

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_REPO="https://github.com/mmont5/autopilotcx-backend.git"
CLIENTDEMO_REPO="https://github.com/mmont5/clientdemo.git"
WORKFLOWS_REPO="https://github.com/mmont5/autopilotcx-workflows.git"

# Temporary directories
TEMP_DIR="/tmp/autopilotcx-deploy"
BACKEND_DIR="$TEMP_DIR/backend"
CLIENTDEMO_DIR="$TEMP_DIR/clientdemo"
WORKFLOWS_DIR="$TEMP_DIR/workflows"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to cleanup temporary directories
cleanup() {
    print_status "Cleaning up temporary directories..."
    rm -rf "$TEMP_DIR"
    print_success "Cleanup completed"
}

# Function to create repository structure
create_backend_structure() {
    print_status "Creating backend repository structure..."
    
    mkdir -p "$BACKEND_DIR"
    cd "$BACKEND_DIR"
    
    # Initialize git repository
    git init
    git remote add origin "$BACKEND_REPO"
    
    # Create backend structure
    mkdir -p apps/demo apps/admin services/n8n workflows docs scripts
    
    # Copy backend-specific files
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/* apps/demo/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/admin/* apps/admin/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/* services/n8n/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows/* workflows/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs/* docs/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/scripts/* scripts/
    
    # Copy configuration files
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/package.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/tsconfig.json ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/.env.example ./
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docker-compose.yml ./
    
    print_success "Backend structure created"
}

create_clientdemo_structure() {
    print_status "Creating client demo repository structure..."
    
    mkdir -p "$CLIENTDEMO_DIR"
    cd "$CLIENTDEMO_DIR"
    
    # Initialize git repository
    git init
    git remote add origin "$CLIENTDEMO_REPO"
    
    # Create client demo structure
    mkdir -p src/components src/app src/lib src/types public
    
    # Copy client demo specific files
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
    
    print_success "Client demo structure created"
}

create_workflows_structure() {
    print_status "Creating workflows repository structure..."
    
    mkdir -p "$WORKFLOWS_DIR"
    cd "$WORKFLOWS_DIR"
    
    # Initialize git repository
    git init
    git remote add origin "$WORKFLOWS_REPO"
    
    # Create workflows structure
    mkdir -p nodes workflows docs examples
    
    # Copy workflow specific files
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/nodes/* nodes/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows/* workflows/
    cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs/* docs/
    
    # Copy N8N configuration
    cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package.json ./
    # Copy tsconfig if it exists, otherwise skip
    if [ -f "/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json" ]; then
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json ./
    elif [ -f "/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json.bak" ]; then
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/tsconfig.json.bak ./tsconfig.json
    fi
    
    print_success "Workflows structure created"
}

# Function to deploy to repository
deploy_to_repository() {
    local repo_name="$1"
    local repo_dir="$2"
    local branch_name="$3"
    
    print_status "Deploying to $repo_name..."
    
    cd "$repo_dir"
    
    # Add all files
    git add .
    
    # Check if there are changes to commit
    if git diff-index --quiet HEAD --; then
        print_warning "No changes to commit in $repo_name"
        return 0
    fi
    
    # Commit changes
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S') - Automated deployment from AutopilotCX codebase"
    
    # Push to repository
    if git push origin main 2>/dev/null; then
        print_success "Successfully deployed to $repo_name"
    else
        # Try pushing to master branch if main doesn't exist
        if git push origin master 2>/dev/null; then
            print_success "Successfully deployed to $repo_name (master branch)"
        else
            print_error "Failed to push to $repo_name"
            return 1
        fi
    fi
}

# Main deployment function
main() {
    print_status "Starting AutopilotCX deployment to repositories..."
    
    # Check prerequisites
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Create temporary directory
    mkdir -p "$TEMP_DIR"
    
    # Store current directory
    CURRENT_DIR=$(pwd)
    
    # Create repository structures
    create_backend_structure
    create_clientdemo_structure
    create_workflows_structure
    
    # Deploy to repositories
    deploy_to_repository "Backend" "$BACKEND_DIR" "main"
    deploy_to_repository "Client Demo" "$CLIENTDEMO_DIR" "main"
    deploy_to_repository "Workflows" "$WORKFLOWS_DIR" "main"
    
    # Return to original directory
    cd "$CURRENT_DIR"
    
    # Cleanup
    cleanup
    
    print_success "Deployment completed successfully!"
    print_status "Repositories updated:"
    echo "  - Backend: $BACKEND_REPO"
    echo "  - Client Demo: $CLIENTDEMO_REPO"
    echo "  - Workflows: $WORKFLOWS_REPO"
}

# Trap to cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 