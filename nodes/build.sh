#!/bin/bash

# Build script for AutopilotCX custom nodes

echo "Building AutopilotCX custom nodes..."

# Clean previous build
rm -rf dist/

# Create dist directory
mkdir -p dist/

# Compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc

# Copy compiled JavaScript files to dist
echo "Copying compiled files..."
cp *.node.js dist/ 2>/dev/null || echo "No .node.js files to copy"

# Copy icons if they exist
if [ -d "icons" ]; then
    echo "Copying icons..."
    cp -r icons dist/
fi

echo "Build complete! Files in dist/:"
ls -la dist/

echo "Custom nodes ready for n8n installation!" 