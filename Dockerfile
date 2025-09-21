# Official N8N Docker Image for AutopilotCX
FROM n8nio/n8n:latest

# Expose port
EXPOSE 5678

# Use the n8n user's home directory as working directory
WORKDIR /home/node

# Start N8N with full path
CMD ["node", "/usr/local/lib/node_modules/n8n/dist/index.js", "start"]