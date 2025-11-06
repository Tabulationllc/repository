#!/bin/bash

echo "Starting IMPLAN Lead Finder Frontend..."
echo ""

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "✓ Frontend setup complete!"
echo ""
echo "Starting React app on http://localhost:3000"
echo ""

# Start the React app
npm start
