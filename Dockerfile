# Official N8N Docker Image for AutopilotCX
FROM n8nio/n8n:latest

# Set environment variables
ENV N8N_BASIC_AUTH_ACTIVE=true
ENV N8N_BASIC_AUTH_USER=admin
ENV N8N_BASIC_AUTH_PASSWORD=autopilotcx2025
ENV WEBHOOK_URL=https://cx.autopilotcx.app
ENV N8N_HOST=cx.autopilotcx.app
ENV N8N_PORT=5678
ENV N8N_PROTOCOL=https
ENV NODE_ENV=production

# Install additional packages if needed
USER root
RUN apk add --no-cache postgresql-client curl

# Create necessary directories
RUN mkdir -p /home/node/.n8n/workflows /home/node/.n8n/credentials && \
    chown -R node:node /home/node/.n8n

# Switch back to n8n user
USER node

# Copy workflows if they exist
COPY --chown=node:node workflows/ /home/node/.n8n/workflows/

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD curl -f http://localhost:5678/healthz || exit 1

# Expose port
EXPOSE 5678

# Start N8N
CMD ["n8n"]