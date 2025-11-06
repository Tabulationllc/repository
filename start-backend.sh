#!/bin/bash

echo "Starting IMPLAN Lead Finder Backend..."
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Copy .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Initialize database
echo "Initializing database..."
python3 -c "from app import app, db; app.app_context().push(); db.create_all()"

echo ""
echo "✓ Backend setup complete!"
echo ""
echo "Starting Flask server on http://localhost:5000"
echo ""

# Run the app
python3 app.py
