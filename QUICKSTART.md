# Quick Start Guide

Get your IMPLAN Lead Finder up and running in 5 minutes!

## Step 1: Set Up Backend (2 minutes)

```bash
# Install Python dependencies
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Initialize database
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Start backend
python app.py
```

Backend will run on http://localhost:5000

## Step 2: Set Up Frontend (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will open at http://localhost:3000

## Step 3: Find Your First Leads (1 minute)

1. Open http://localhost:3000 in your browser
2. Click "Find Leads" in the navigation
3. Enter search term: "IMPLAN economic impact"
4. Click "Search for Leads"
5. View your new contacts in the Contacts page!

## That's It!

You're ready to start finding and managing IMPLAN leads.

## Next Steps

- Add notes to track your outreach
- Export leads to Google Sheets (optional - requires Google API setup)
- Sync to HubSpot (optional - requires HubSpot API key)
- Manually add organizations you know about

## Optional: Set Up Integrations

### Google Sheets (5 minutes)
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google Sheets API
3. Create Service Account → Download credentials.json
4. Place credentials.json in project root
5. Add to .env: `GOOGLE_SHEETS_CREDENTIALS_FILE=credentials.json`

### HubSpot (2 minutes)
1. Go to HubSpot Settings → Integrations → API Key
2. Generate key
3. Add to .env: `HUBSPOT_API_KEY=your-key-here`
4. Restart backend: `python app.py`

## Need Help?

Check the full [README.md](README.md) for detailed documentation.
