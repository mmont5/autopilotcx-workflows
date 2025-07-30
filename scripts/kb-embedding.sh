#!/bin/bash

# Set environment variables
export PYTHONPATH=$PYTHONPATH:$(pwd)
export KB_DIR="docs/kb"
export EMBEDDINGS_DIR="data/embeddings"

# Create embeddings directory if it doesn't exist
mkdir -p $EMBEDDINGS_DIR

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install required packages
pip install -r requirements.txt

# Run the embedding script
python scripts/generate_embeddings.py \
    --input_dir $KB_DIR \
    --output_dir $EMBEDDINGS_DIR \
    --model_name "sentence-transformers/all-MiniLM-L6-v2" \
    --batch_size 32 \
    --chunk_size 512 \
    --chunk_overlap 50

# Update the search index
python scripts/update_search_index.py \
    --embeddings_dir $EMBEDDINGS_DIR \
    --output_file "data/search_index.json"

# Clean up old embeddings (keep last 7 days)
find $EMBEDDINGS_DIR -type f -mtime +7 -delete

# Log completion
echo "Knowledge base embedding completed at $(date)" >> logs/kb-embedding.log 