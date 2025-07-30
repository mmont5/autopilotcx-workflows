#!/bin/bash

# N8N Control Script
# Quick commands to manage the working N8N setup

set -e

CONTAINER_NAME="n8n-working"
PROJECT_ROOT="/Users/hitz/Documents/Projects/AutopilotCX-New-June-20-2025"
N8N_DIR="$PROJECT_ROOT/services/n8n"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Function to check if container exists
container_exists() {
    docker ps -a --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"
}

# Function to check if container is running
container_running() {
    docker ps --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"
}

# Function to start N8N
start_n8n() {
    print_header "Starting N8N"
    
    if container_running; then
        print_warning "N8N is already running!"
        return 0
    fi
    
    if container_exists; then
        print_status "Removing existing stopped container..."
        docker rm $CONTAINER_NAME
    fi
    
    cd "$N8N_DIR"
    
    print_status "Starting N8N container..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p 5678:5678 \
        -v $PWD/../../.n8n:/home/node/.n8n \
        -v $PWD/../n8n-project:/data/workflows \
        -e N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom \
        -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false \
        n8nio/n8n:latest
    
    print_status "Waiting for N8N to start..."
    sleep 5
    
    if container_running; then
        print_status "N8N started successfully!"
        print_status "Access at: http://localhost:5678"
        print_status "Health check: http://localhost:5678/healthz"
    else
        print_error "Failed to start N8N!"
        docker logs $CONTAINER_NAME --tail 20
        exit 1
    fi
}

# Function to stop N8N
stop_n8n() {
    print_header "Stopping N8N"
    
    if ! container_exists; then
        print_warning "N8N container does not exist!"
        return 0
    fi
    
    if container_running; then
        print_status "Stopping N8N container..."
        docker stop $CONTAINER_NAME
        print_status "N8N stopped successfully!"
    else
        print_warning "N8N is not running!"
    fi
    
    print_status "Removing container..."
    docker rm $CONTAINER_NAME
    print_status "Container removed!"
}

# Function to restart N8N
restart_n8n() {
    print_header "Restarting N8N"
    stop_n8n
    start_n8n
}

# Function to show status
status_n8n() {
    print_header "N8N Status"
    
    if container_exists; then
        if container_running; then
            print_status "Container: $CONTAINER_NAME"
            print_status "Status: RUNNING"
            print_status "Port: 5678"
            print_status "URL: http://localhost:5678"
            
            # Health check
            if curl -s http://localhost:5678/healthz > /dev/null 2>&1; then
                print_status "Health: OK"
            else
                print_warning "Health: FAILED"
            fi
            
            echo ""
            print_status "Recent logs:"
            docker logs $CONTAINER_NAME --tail 10
        else
            print_warning "Container exists but is not running!"
            print_status "Use './n8n-control.sh start' to start it"
        fi
    else
        print_warning "N8N container does not exist!"
        print_status "Use './n8n-control.sh start' to create and start it"
    fi
}

# Function to show logs
logs_n8n() {
    print_header "N8N Logs"
    
    if container_exists; then
        docker logs $CONTAINER_NAME --tail 50
    else
        print_error "N8N container does not exist!"
        exit 1
    fi
}

# Function to backup
backup_n8n() {
    print_header "Backing up N8N"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    print_status "Creating backup with timestamp: $TIMESTAMP"
    
    if [ -d "$PROJECT_ROOT/.n8n" ]; then
        cp -r "$PROJECT_ROOT/.n8n" "$PROJECT_ROOT/.n8n.backup.$TIMESTAMP"
        print_status "Backed up .n8n directory"
    else
        print_warning ".n8n directory not found!"
    fi
    
    if [ -d "$PROJECT_ROOT/n8n-project" ]; then
        cp -r "$PROJECT_ROOT/n8n-project" "$PROJECT_ROOT/n8n-project.backup.$TIMESTAMP"
        print_status "Backed up n8n-project directory"
    else
        print_warning "n8n-project directory not found!"
    fi
    
    print_status "Backup completed!"
}

# Function to show help
show_help() {
    print_header "N8N Control Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start N8N container"
    echo "  stop      Stop and remove N8N container"
    echo "  restart   Restart N8N container"
    echo "  status    Show N8N status and health"
    echo "  logs      Show N8N logs"
    echo "  backup    Backup N8N configuration and workflows"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start      # Start N8N"
    echo "  $0 status     # Check status"
    echo "  $0 logs       # View logs"
    echo "  $0 stop       # Stop N8N"
    echo ""
}

# Main script logic
case "${1:-help}" in
    start)
        start_n8n
        ;;
    stop)
        stop_n8n
        ;;
    restart)
        restart_n8n
        ;;
    status)
        status_n8n
        ;;
    logs)
        logs_n8n
        ;;
    backup)
        backup_n8n
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 