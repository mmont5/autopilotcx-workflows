#!/bin/bash

# Comprehensive script to push entire codebase to repositories
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
        
        # Copy entire project structure (excluding problematic directories)
        cp -r "$PROJECT_ROOT/apps" ./
        
        # Copy services (excluding problematic directories)
        mkdir -p services
        # Copy without following symlinks using rsync
        rsync -av --exclude='.n8n' --exclude='node_modules' --exclude='.turbo' --exclude='test-results' --exclude='playwright-report' --exclude='.DS_Store' "$PROJECT_ROOT/services/n8n/" services/n8n/
        
        # Remove problematic directories and symlinks
        rm -rf services/n8n/.n8n 2>/dev/null || true
        rm -rf services/n8n/node_modules 2>/dev/null || true
        rm -rf services/n8n/.turbo 2>/dev/null || true
        rm -rf services/n8n/test-results 2>/dev/null || true
        rm -rf services/n8n/playwright-report 2>/dev/null || true
        rm -rf services/n8n/.DS_Store 2>/dev/null || true
        
        cp -r "$PROJECT_ROOT/workflows" ./
        cp -r "$PROJECT_ROOT/docs" ./
        cp -r "$PROJECT_ROOT/scripts" ./
        cp -r "$PROJECT_ROOT/supabase" ./
        cp -r "$PROJECT_ROOT/packages" ./
        cp -r "$PROJECT_ROOT/libs" ./
        cp -r "$PROJECT_ROOT/prompts" ./
        
        # Copy configuration files
        cp "$PROJECT_ROOT/package.json" ./
        cp "$PROJECT_ROOT/tsconfig.json" ./
        cp "$PROJECT_ROOT/docker-compose.yml" ./
        cp "$PROJECT_ROOT/.env.example" ./
        cp "$PROJECT_ROOT/README-backend.md" ./README.md
        cp "$PROJECT_ROOT/.gitignore" ./
        
    elif [ "$repo_name" = "clientdemo" ]; then
        print_status "Copying client demo files..."
        
        # Copy entire demo app
        cp -r "$PROJECT_ROOT/apps/demo" ./
        
        # Copy configuration files (only if they exist)
        if [ -f "$PROJECT_ROOT/apps/demo/package.json" ]; then
            cp "$PROJECT_ROOT/apps/demo/package.json" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/tsconfig.json" ]; then
            cp "$PROJECT_ROOT/apps/demo/tsconfig.json" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/next.config.js" ]; then
            cp "$PROJECT_ROOT/apps/demo/next.config.js" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/tailwind.config.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/tailwind.config.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/.eslintrc.json" ]; then
            cp "$PROJECT_ROOT/apps/demo/.eslintrc.json" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/playwright.config.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/playwright.config.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/drizzle.config.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/drizzle.config.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/biome.jsonc" ]; then
            cp "$PROJECT_ROOT/apps/demo/biome.jsonc" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/components.json" ]; then
            cp "$PROJECT_ROOT/apps/demo/components.json" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/instrumentation.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/instrumentation.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/middleware.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/middleware.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/schema.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/schema.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/next-env.d.ts" ]; then
            cp "$PROJECT_ROOT/apps/demo/next-env.d.ts" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/LICENSE" ]; then
            cp "$PROJECT_ROOT/apps/demo/LICENSE" ./
        fi
        if [ -f "$PROJECT_ROOT/apps/demo/.gitignore" ]; then
            cp "$PROJECT_ROOT/apps/demo/.gitignore" ./
        fi
        cp "$PROJECT_ROOT/README-clientdemo.md" ./README.md
        
    elif [ "$repo_name" = "workflows" ]; then
        print_status "Copying workflows files..."
        
        # Copy N8N services (excluding problematic directories)
        mkdir -p services
        # Copy without following symlinks using rsync
        rsync -av --exclude='.n8n' --exclude='node_modules' --exclude='.turbo' --exclude='test-results' --exclude='playwright-report' --exclude='.DS_Store' "$PROJECT_ROOT/services/n8n/" services/n8n/
        
        # Copy workflows
        cp -r "$PROJECT_ROOT/workflows" ./
        
        # Copy docs
        cp -r "$PROJECT_ROOT/docs" ./
        
        # Copy scripts
        cp -r "$PROJECT_ROOT/scripts" ./
        
        # Copy configuration files
        cp "$PROJECT_ROOT/services/n8n/package.json" ./
        cp "$PROJECT_ROOT/services/n8n/package-lock.json" ./
        cp "$PROJECT_ROOT/services/n8n/docker-compose.yml" ./
        cp "$PROJECT_ROOT/services/n8n/Dockerfile" ./
        cp "$PROJECT_ROOT/services/n8n/README.md" ./
        cp "$PROJECT_ROOT/README-workflows.md" ./README.md
        cp "$PROJECT_ROOT/.gitignore" ./
    fi
    
    # Add all files
    git add .
    
    # Commit
    git commit -m "Update $repo_name code - $(date '+%Y-%m-%d %H:%M:%S') - Full codebase push"
    
    # Push to repository
    git push origin "$branch"
    
    print_success "$repo_name repository updated and pushed"
    
    # Cleanup
    cd "$PROJECT_ROOT"
    rm -rf "$temp_dir"
}

# Main execution
print_status "Starting comprehensive repository push process..."

# Push to each repository
push_to_repo "backend" "$BACKEND_REPO" "main"
push_to_repo "clientdemo" "$CLIENTDEMO_REPO" "main"
push_to_repo "workflows" "$WORKFLOWS_REPO" "master"

print_success "All repositories updated successfully!"
print_status "Repositories updated:"
echo "  - Backend: $BACKEND_REPO"
echo "  - Client Demo: $CLIENTDEMO_REPO"
echo "  - Workflows: $WORKFLOWS_REPO" 