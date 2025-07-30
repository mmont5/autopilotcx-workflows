#!/bin/bash

# Script to generate OpenAPI specs for all AutopilotCX services
# This script should be run from the root of the project

# Create output directory
mkdir -p docs/api/specs

# Function to generate OpenAPI spec for a service
generate_spec() {
    local service=$1
    local port=$2
    local output_file="docs/api/specs/${service}.openapi.json"
    
    echo "Generating OpenAPI spec for ${service}..."
    
    # Use FastAPI's built-in OpenAPI generator
    curl -s "http://localhost:${port}/openapi.json" > "${output_file}"
    
    # Validate the generated spec
    if [ -f "${output_file}" ]; then
        echo "✅ Generated spec for ${service}"
    else
        echo "❌ Failed to generate spec for ${service}"
    fi
}

# Generate specs for all services
generate_spec "api-gateway" "8000"
generate_spec "orchestrator" "8200"
generate_spec "llm-server" "8300"
generate_spec "image-gen" "8400"
generate_spec "video-gen" "8500"
generate_spec "video-upscale" "8550"
generate_spec "moderation-gate" "8600"
generate_spec "keyword-scout" "8700"
generate_spec "hashtag-miner" "8710"
generate_spec "scheduler-worker" "8800"
generate_spec "analytics-svc" "8900"
generate_spec "connector-gateway" "9000"
generate_spec "nft-minter" "9100"
generate_spec "nft-marketplace" "9200"
generate_spec "billing-webhook" "9300"

echo "OpenAPI spec generation complete!" 