FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    python3 \
    curl

# Install TypeScript globally
RUN npm install -g typescript

# Install n8n globally
RUN npm install -g n8n@1.90.2

# Create n8n user (node user already exists in base image)
RUN adduser -D -s /bin/sh -u 1000 -G node node || true

# Switch to node user
USER node

# Set working directory
WORKDIR /home/node/.n8n

# Copy custom nodes source
COPY --chown=node:node ./nodes /tmp/custom-nodes/
COPY --chown=node:node ./icons /tmp/custom-nodes/icons/

# Compile TypeScript nodes
RUN cd /tmp/custom-nodes && \
    npm install --include=dev && \
    tsc && \
    echo "Custom nodes compiled successfully"

# Create custom nodes directory
RUN mkdir -p /home/node/.n8n/custom

# Copy compiled nodes and icons to custom directory
RUN cp /tmp/custom-nodes/*.node.js /home/node/.n8n/custom/ && \
    cp /tmp/custom-nodes/icons/*.svg /home/node/.n8n/custom/ && \
    echo "Custom nodes and icons copied to /home/node/.n8n/custom"

# Clean up
RUN rm -rf /tmp/custom-nodes

# Set environment variable for custom extensions
ENV N8N_CUSTOM_EXTENSIONS="/home/node/.n8n/custom"

# Expose port
EXPOSE 5678

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5678/healthz || exit 1

# Start n8n
CMD ["n8n"] 