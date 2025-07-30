#!/bin/bash

# Set environment variables
export PGPASSWORD=$DB_PASSWORD
export BACKUP_DIR="/tmp/backups"
export S3_BUCKET="autopilotcx-backups"
export DATE=$(date +%Y-%m-%d_%H-%M-%S)
export BACKUP_FILE="autopilotcx_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform pg_dump
pg_dump \
    -h $DB_HOST \
    -U $DB_USER \
    -d $DB_NAME \
    -F c \
    -f "$BACKUP_DIR/$BACKUP_FILE"

# Compress the backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Upload to S3
aws s3 cp \
    "$BACKUP_DIR/$BACKUP_FILE.gz" \
    "s3://$S3_BUCKET/database/$BACKUP_FILE.gz" \
    --storage-class STANDARD_IA

# Clean up local backup
rm "$BACKUP_DIR/$BACKUP_FILE.gz"

# Clean up old backups in S3 (keep last 30 days)
aws s3 ls "s3://$S3_BUCKET/database/" | \
    grep "autopilotcx_" | \
    sort -r | \
    tail -n +31 | \
    while read -r line; do
        filename=$(echo "$line" | awk '{print $4}')
        aws s3 rm "s3://$S3_BUCKET/database/$filename"
    done

# Log completion
echo "Database backup completed at $(date)" >> logs/backup-db.log 