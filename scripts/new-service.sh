#!/bin/bash

# Check if service name and language are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <service-name> <language>"
    echo "Example: $0 llm-server python"
    exit 1
fi

SERVICE_NAME=$1
LANGUAGE=$2
SERVICE_DIR="services/$SERVICE_NAME"

# Create service directory structure
mkdir -p "$SERVICE_DIR/src"
mkdir -p "$SERVICE_DIR/tests"

# Create basic files based on language
case $LANGUAGE in
    python)
        # Create Python service structure
        mkdir -p "$SERVICE_DIR/src/{api,core,models,utils}"
        
        # Create requirements.txt
        cat > "$SERVICE_DIR/requirements.txt" << EOF
fastapi==0.109.2
uvicorn==0.27.1
pydantic==2.6.1
python-dotenv==1.0.1
httpx==0.26.0
pytest==8.0.0
pytest-asyncio==0.23.5
black==24.1.1
isort==5.13.2
mypy==1.8.0
EOF
        
        # Create main.py
        cat > "$SERVICE_DIR/src/main.py" << EOF
from fastapi import FastAPI
import os

app = FastAPI(
    title="$SERVICE_NAME",
    description="Service description",
    version="1.0.0"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("${SERVICE_NAME^^}_PORT", "8000")),
        reload=True
    )
EOF
        
        # Create Dockerfile.dev
        cat > "$SERVICE_DIR/Dockerfile.dev" << EOF
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    gcc \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE \${${SERVICE_NAME^^}_PORT:-8000}

# Start development server
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "\${${SERVICE_NAME^^}_PORT:-8000}", "--reload"]
EOF
        ;;
        
    typescript)
        # Create TypeScript service structure
        mkdir -p "$SERVICE_DIR/src/{api,core,models,utils}"
        
        # Create package.json
        cat > "$SERVICE_DIR/package.json" << EOF
{
  "name": "$SERVICE_NAME",
  "version": "1.0.0",
  "main": "dist/main.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
EOF
        
        # Create main.ts
        cat > "$SERVICE_DIR/src/main.ts" << EOF
import express from 'express';

const app = express();
const port = process.env.${SERVICE_NAME^^}_PORT || 8000;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(\`$SERVICE_NAME service listening at http://localhost:\${port}\`);
});
EOF
        
        # Create Dockerfile.dev
        cat > "$SERVICE_DIR/Dockerfile.dev" << EOF
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE \${${SERVICE_NAME^^}_PORT:-8000}

# Start development server
CMD ["npm", "run", "dev"]
EOF
        ;;
        
    *)
        echo "Unsupported language: $LANGUAGE"
        echo "Supported languages: python, typescript"
        exit 1
        ;;
esac

# Make the script executable
chmod +x "$SERVICE_DIR/Dockerfile.dev"

echo "Created new $LANGUAGE service: $SERVICE_NAME"
echo "Directory: $SERVICE_DIR" 