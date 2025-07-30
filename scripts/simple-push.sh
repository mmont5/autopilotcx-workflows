#!/bin/bash

# Simple script to push code to existing repositories
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to push to a repository
push_to_repo() {
    local repo_name="$1"
    local repo_url="$2"
    local temp_dir="/tmp/autopilotcx-$repo_name"
    
    print_status "Pushing to $repo_name repository..."
    
    # Clean up any existing temp directory
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    cd "$temp_dir"
    
    # Clone the repository
    git clone "$repo_url" .
    
    # Remove all existing files except .git
    find . -mindepth 1 -not -path './.git*' -delete
    
    # Copy files based on repository type
    if [ "$repo_name" = "backend" ]; then
        # Backend repository
        mkdir -p apps services workflows docs scripts
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/* apps/
        
        # Copy N8N services (excluding problematic directories)
        mkdir -p services/n8n
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/nodes services/n8n/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/dist services/n8n/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/custom-nodes services/n8n/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package.json services/n8n/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package-lock.json services/n8n/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/docker-compose.yml services/n8n/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/Dockerfile services/n8n/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/README.md services/n8n/
        
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows ./
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs ./
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/scripts ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/package.json ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/tsconfig.json ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docker-compose.yml ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/.env.example ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-backend.md ./README.md
        
    elif [ "$repo_name" = "clientdemo" ]; then
        # Client demo repository
        mkdir -p src/{components,app,lib,types} public
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/components/* src/components/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/app/* src/app/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/lib/* src/lib/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/types/* src/types/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/public/* public/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/package.json ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/tsconfig.json ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/next.config.js ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/apps/demo/tailwind.config.ts ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-clientdemo.md ./README.md
        
    elif [ "$repo_name" = "workflows" ]; then
        # Workflows repository
        mkdir -p nodes workflows docs
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/nodes/* nodes/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/workflows/* workflows/
        cp -r /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/docs/* docs/
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/services/n8n/package.json ./
        cp /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025/README-workflows.md ./README.md
    fi
    
    # Add and commit
    git add .
    git commit -m "Update $repo_name code - $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to repository
    if [ "$repo_name" = "workflows" ]; then
        git push origin master
    else
        git push origin main
    fi
    
    print_success "$repo_name repository updated and pushed"
    
    # Cleanup
    cd /Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025
    rm -rf "$temp_dir"
}

# Main execution
print_status "Starting repository push process..."

# Push to each repository
push_to_repo "backend" "https://github.com/mmont5/autopilotcx-backend.git"
push_to_repo "clientdemo" "https://github.com/mmont5/clientdemo.git"
push_to_repo "workflows" "https://github.com/mmont5/autopilotcx-workflows.git"

print_success "All repositories updated successfully!"
print_status "Repositories updated:"
echo "  - Backend: https://github.com/mmont5/autopilotcx-backend"
echo "  - Client Demo: https://github.com/mmont5/clientdemo"
echo "  - Workflows: https://github.com/mmont5/autopilotcx-workflows" 