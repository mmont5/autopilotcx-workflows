#!/bin/bash

# Convert TypeScript files to JavaScript in-place in the nodes directory
# This will place .js files next to their .ts sources in services/n8n/nodes/
echo "Converting TypeScript files to JavaScript..."
for file in services/n8n/nodes/*.ts; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .ts)
        echo "Converting $filename.ts..."
        npx tsc "$file" --outDir services/n8n/nodes --target ES2018 --module commonjs --esModuleInterop true
    fi
done

echo "Conversion complete. JavaScript files are in services/n8n/nodes/" 