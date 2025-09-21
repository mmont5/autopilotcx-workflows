# Official N8N Docker Image for AutopilotCX
FROM n8nio/n8n:latest

# Expose port
EXPOSE 5678

# Start N8N
CMD ["n8n"]