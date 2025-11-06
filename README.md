# IMPLAN Lead Finder

A comprehensive CRM-style web application for finding and managing potential customers for your IMPLAN application. This tool helps you discover individuals, businesses, academics, and organizations that use IMPLAN for economic impact analysis.

## Features

### 🔍 Lead Discovery
- **Academic Research Search**: Find researchers and academics who publish papers using IMPLAN
- **Business/Consultant Finder**: Identify consulting firms offering IMPLAN services
- **Automated Contact Extraction**: Automatically extract contact information from sources

### 💼 CRM Functionality
- **HubSpot-Style Interface**: Clean, modern interface for managing leads
- **Organizations Management**: Track businesses, universities, and consulting firms
- **Contact Management**: Store and manage individual contacts with research interests
- **Notes & Activity Tracking**: Add notes for calls, emails, meetings, and research
- **Status Tracking**: Mark leads as Not Contacted, Contacted, Qualified, or Lost
- **Priority Levels**: Set High, Medium, or Low priority for leads

### 📊 Export & Integration
- **Google Sheets Export**: Export organizations and contacts to Google Sheets
- **HubSpot Integration**: Sync organizations and contacts directly to HubSpot CRM
- **Data Persistence**: SQLite database stores all your leads and notes

## Technology Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **BeautifulSoup4**: Web scraping
- **Google Sheets API**: Export functionality
- **HubSpot API**: CRM integration

### Frontend
- **React**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Modern CSS**: Clean, professional styling

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
cd /home/user/repository
```

2. **Create and activate virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `SECRET_KEY`: Generate a secure random key
- `GOOGLE_SHEETS_CREDENTIALS_FILE`: Path to Google Service Account JSON (optional)
- `HUBSPOT_API_KEY`: Your HubSpot API key (optional)

5. **Initialize the database**
```bash
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

6. **Run the Flask backend**
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Setting Up Integrations

### Google Sheets Export (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account
5. Download the JSON credentials file
6. Save it as `credentials.json` in the project root
7. Update `.env` with: `GOOGLE_SHEETS_CREDENTIALS_FILE=credentials.json`

### HubSpot Integration (Optional)

1. Log in to your HubSpot account
2. Go to Settings → Integrations → API Key
3. Generate an API key
4. Update `.env` with: `HUBSPOT_API_KEY=your-api-key-here`

## Usage Guide

### 1. Finding Leads

#### Academic Research
1. Go to **Find Leads** page
2. Select **Academic Research** tab
3. Enter search terms (e.g., "IMPLAN economic impact")
4. Set max results (1-50)
5. Click **Search for Leads**
6. Contacts will be automatically added to your database

#### Manual Entry
1. Go to **Organizations** page
2. Click **+ Add Organization**
3. Fill in details and save
4. View organization details to add contacts

### 2. Managing Organizations

- **View All**: Organizations page shows all tracked organizations
- **Filter**: Filter by status (Not Contacted, Contacted, Qualified, Lost) and type
- **Edit**: Click on an organization to view/edit details
- **Add Contacts**: Add multiple contacts for each organization
- **Track Status**: Update status and priority as you progress
- **Add Notes**: Record calls, emails, meetings, and research

### 3. Managing Contacts

- **View All**: Contacts page shows all individuals
- **Contact Details**: Click to view full profile with research interests
- **Email & LinkedIn**: Direct links to contact via email or LinkedIn
- **Add Notes**: Track all interactions with each contact

### 4. Adding Notes

Notes help you track your outreach process:
- **Call**: Record phone conversations
- **Email**: Log email communications
- **Meeting**: Document meetings
- **Research**: Save research findings
- **Other**: Any other notes

### 5. Exporting Data

#### To Google Sheets
1. Go to Organizations or Contacts page
2. Click **Export to Google Sheets**
3. A new Google Sheet will be created
4. The URL will open automatically

#### To HubSpot
1. Open an organization's detail page
2. Click **Sync to HubSpot**
3. Organization and contacts will be synced
4. Future updates can use **Re-sync to HubSpot**

### 6. Dashboard

The dashboard provides an overview:
- Total organizations and contacts
- Number of not contacted leads
- Number of qualified leads
- Recent organizations and contacts

## Search Tips

### Academic Searches
- "IMPLAN" - Basic search for any mention
- "IMPLAN economic impact analysis" - More specific
- "IMPLAN regional economics" - Focus on regional analysis
- "IMPLAN tourism" - Industry-specific
- "IMPLAN California" - Location-specific

### Finding Different Types of Leads

1. **University Researchers**
   - Search: "IMPLAN" in academic papers
   - Look for authors with university affiliations
   - Check for economic development departments

2. **Consulting Firms**
   - Search: "IMPLAN consulting services"
   - Search: "economic impact analysis IMPLAN"
   - Look for firms advertising IMPLAN expertise

3. **Government Agencies**
   - Search: "IMPLAN government economic analysis"
   - Look for state/regional planning departments

4. **Industry Analysts**
   - Search: "IMPLAN [industry name]"
   - Examples: agriculture, energy, tourism

## Project Structure

```
repository/
├── app.py                 # Flask backend application
├── models.py              # Database models
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create from .env.example)
├── scrapers/             # Web scraping modules
│   ├── base_scraper.py
│   ├── academic_scraper.py
│   └── business_scraper.py
├── integrations/         # External API integrations
│   ├── google_sheets.py
│   └── hubspot.py
└── frontend/             # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        ├── api.js
        └── pages/
            ├── Dashboard.js
            ├── Organizations.js
            ├── OrganizationDetail.js
            ├── Contacts.js
            ├── ContactDetail.js
            └── Scraper.js
```

## API Endpoints

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/:id` - Get single organization
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Contacts
- `GET /api/contacts` - List all contacts
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Notes
- `GET /api/notes` - List all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Scraping
- `POST /api/scrape/academic` - Search academic sources
- `POST /api/scrape/business` - Search business sources

### Export
- `POST /api/export/google-sheets` - Export to Google Sheets
- `POST /api/export/hubspot` - Sync to HubSpot

### Stats
- `GET /api/stats` - Get dashboard statistics

## Database Schema

### Organizations
- Basic info: name, type, website, location, industry, size
- CRM fields: status, priority, source
- Integration: hubspot_id
- Relationships: contacts, notes

### Contacts
- Personal info: name, title, email, phone, LinkedIn
- Research: interests, publications, Google Scholar
- CRM fields: status
- Integration: hubspot_id
- Relationships: organization, notes

### Notes
- Content and type (Call, Email, Meeting, Research, Other)
- Linked to organization and/or contact
- Timestamps

## Best Practices

1. **Regular Searches**: Run searches weekly with different keywords
2. **Update Status**: Keep lead status current as you contact them
3. **Add Notes Immediately**: Log interactions right after they happen
4. **Prioritize Leads**: Set priority levels to focus on best prospects
5. **Sync to HubSpot**: If using HubSpot, sync regularly to keep data in sync
6. **Export Backups**: Periodically export to Google Sheets as backup

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Ensure virtual environment is activated
- Verify all dependencies installed: `pip install -r requirements.txt`

### Frontend won't start
- Check Node version: `node --version` (need 16+)
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Google Sheets export fails
- Verify credentials.json file exists
- Check that Google Sheets API is enabled
- Ensure service account has proper permissions

### HubSpot sync fails
- Verify API key is correct
- Check that API key has proper scopes (contacts, companies)
- Ensure organization has required fields (name)

### Scraping returns no results
- Google Scholar may rate-limit requests
- Try different search terms
- Reduce max_results
- Wait a few minutes between searches

## Future Enhancements

- LinkedIn search integration
- Advanced business search with multiple sources
- Email finding services integration (Hunter.io, etc.)
- Automated email campaigns
- Advanced analytics and reporting
- Chrome extension for quick lead capture
- Import from CSV
- Custom fields and tags
- Team collaboration features

## License

This project is proprietary software for internal use.

## Support

For issues or questions, please refer to the documentation or contact the development team.
