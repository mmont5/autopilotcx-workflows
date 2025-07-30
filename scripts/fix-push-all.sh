#!/bin/bash

# Fix script to push entire codebase to repositories
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

# Project root
PROJECT_ROOT="/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025"

# Function to push to repository
push_to_repo() {
    local repo_name="$1"
    local repo_url="$2"
    local branch="$3"
    local temp_dir="/tmp/autopilotcx-$repo_name-$(date +%s)"
    
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
        print_status "Copying backend files..."
        
        # Copy entire project structure using rsync to avoid symlink issues
        rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.turbo' --exclude='test-results' --exclude='playwright-report' --exclude='.DS_Store' "$PROJECT_ROOT/" ./
        
        # Remove the demo app since it goes to clientdemo repo
        rm -rf apps/demo
        
        # Copy README
        cp "$PROJECT_ROOT/README-backend.md" ./README.md
        
    elif [ "$repo_name" = "clientdemo" ]; then
        print_status "Copying client demo files..."
        
        # Copy only the demo app
        cp -r "$PROJECT_ROOT/apps/demo" ./
        
        # Copy README
        cp "$PROJECT_ROOT/README-clientdemo.md" ./README.md
        
    elif [ "$repo_name" = "workflows" ]; then
        print_status "Copying workflows files..."
        
        # Copy N8N services using rsync to avoid symlink issues
        rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.turbo' --exclude='test-results' --exclude='playwright-report' --exclude='.DS_Store' "$PROJECT_ROOT/services/n8n/" ./
        
        # Copy workflows
        cp -r "$PROJECT_ROOT/workflows" ./
        
        # Copy docs
        cp -r "$PROJECT_ROOT/docs" ./
        
        # Copy scripts
        cp -r "$PROJECT_ROOT/scripts" ./
        
        # Copy README
        cp "$PROJECT_ROOT/README-workflows.md" ./README.md
    fi
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "Update $repo_name code - $(date '+%Y-%m-%d %H:%M:%S') - Complete codebase backup"
    
    # Push to repository
    git push origin "$branch"
    
    print_success "$repo_name repository updated and pushed"
    
    # Cleanup
    cd "$PROJECT_ROOT"
    rm -rf "$temp_dir"
}

# Main execution
print_status "Starting complete repository backup process..."

# Push to each repository
push_to_repo "backend" "$BACKEND_REPO" "main"
push_to_repo "clientdemo" "$CLIENTDEMO_REPO" "main"
push_to_repo "workflows" "$WORKFLOWS_REPO" "master"

print_success "All repositories updated successfully!"
print_status "Complete backup completed:"
echo "  - Backend: $BACKEND_REPO"
echo "  - Client Demo: $CLIENTDEMO_REPO"
echo "  - Workflows: $WORKFLOWS_REPO" 