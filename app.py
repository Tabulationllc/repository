from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Organization, Contact, Note
from scrapers import AcademicScraper, BusinessScraper
from integrations import GoogleSheetsExporter, HubSpotIntegration
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///implan_leads.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize integrations
google_sheets = GoogleSheetsExporter()
hubspot = HubSpotIntegration()

# Create database tables
with app.app_context():
    db.create_all()


# ==================== ORGANIZATIONS ====================

@app.route('/api/organizations', methods=['GET'])
def get_organizations():
    """Get all organizations with optional filtering"""
    status = request.args.get('status')
    org_type = request.args.get('type')
    priority = request.args.get('priority')

    query = Organization.query

    if status:
        query = query.filter_by(status=status)
    if org_type:
        query = query.filter_by(type=org_type)
    if priority:
        query = query.filter_by(priority=priority)

    organizations = query.order_by(Organization.created_at.desc()).all()
    return jsonify([org.to_dict() for org in organizations])


@app.route('/api/organizations/<int:org_id>', methods=['GET'])
def get_organization(org_id):
    """Get a single organization by ID"""
    org = Organization.query.get_or_404(org_id)
    return jsonify(org.to_dict())


@app.route('/api/organizations', methods=['POST'])
def create_organization():
    """Create a new organization"""
    data = request.json

    org = Organization(
        name=data.get('name'),
        type=data.get('type'),
        website=data.get('website'),
        description=data.get('description'),
        location=data.get('location'),
        industry=data.get('industry'),
        size=data.get('size'),
        status=data.get('status', 'Not Contacted'),
        priority=data.get('priority', 'Medium'),
        source=data.get('source')
    )

    db.session.add(org)
    db.session.commit()

    return jsonify(org.to_dict()), 201


@app.route('/api/organizations/<int:org_id>', methods=['PUT'])
def update_organization(org_id):
    """Update an organization"""
    org = Organization.query.get_or_404(org_id)
    data = request.json

    # Update fields
    for field in ['name', 'type', 'website', 'description', 'location',
                  'industry', 'size', 'status', 'priority', 'source']:
        if field in data:
            setattr(org, field, data[field])

    db.session.commit()
    return jsonify(org.to_dict())


@app.route('/api/organizations/<int:org_id>', methods=['DELETE'])
def delete_organization(org_id):
    """Delete an organization"""
    org = Organization.query.get_or_404(org_id)
    db.session.delete(org)
    db.session.commit()
    return '', 204


# ==================== CONTACTS ====================

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    """Get all contacts with optional filtering"""
    org_id = request.args.get('organization_id')
    status = request.args.get('status')

    query = Contact.query

    if org_id:
        query = query.filter_by(organization_id=org_id)
    if status:
        query = query.filter_by(status=status)

    contacts = query.order_by(Contact.created_at.desc()).all()
    return jsonify([contact.to_dict() for contact in contacts])


@app.route('/api/contacts/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    """Get a single contact by ID"""
    contact = Contact.query.get_or_404(contact_id)
    return jsonify(contact.to_dict())


@app.route('/api/contacts', methods=['POST'])
def create_contact():
    """Create a new contact"""
    data = request.json

    contact = Contact(
        organization_id=data.get('organization_id'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        full_name=data.get('full_name'),
        title=data.get('title'),
        email=data.get('email'),
        phone=data.get('phone'),
        linkedin_url=data.get('linkedin_url'),
        research_interests=data.get('research_interests'),
        publications=data.get('publications'),
        google_scholar_url=data.get('google_scholar_url'),
        status=data.get('status', 'Not Contacted')
    )

    db.session.add(contact)
    db.session.commit()

    return jsonify(contact.to_dict()), 201


@app.route('/api/contacts/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    """Update a contact"""
    contact = Contact.query.get_or_404(contact_id)
    data = request.json

    # Update fields
    for field in ['first_name', 'last_name', 'full_name', 'title', 'email',
                  'phone', 'linkedin_url', 'research_interests', 'publications',
                  'google_scholar_url', 'status', 'organization_id']:
        if field in data:
            setattr(contact, field, data[field])

    db.session.commit()
    return jsonify(contact.to_dict())


@app.route('/api/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    """Delete a contact"""
    contact = Contact.query.get_or_404(contact_id)
    db.session.delete(contact)
    db.session.commit()
    return '', 204


# ==================== NOTES ====================

@app.route('/api/notes', methods=['GET'])
def get_notes():
    """Get all notes"""
    org_id = request.args.get('organization_id')
    contact_id = request.args.get('contact_id')

    query = Note.query

    if org_id:
        query = query.filter_by(organization_id=org_id)
    if contact_id:
        query = query.filter_by(contact_id=contact_id)

    notes = query.order_by(Note.created_at.desc()).all()
    return jsonify([note.to_dict() for note in notes])


@app.route('/api/notes', methods=['POST'])
def create_note():
    """Create a new note"""
    data = request.json

    note = Note(
        organization_id=data.get('organization_id'),
        contact_id=data.get('contact_id'),
        content=data.get('content'),
        note_type=data.get('note_type', 'Other')
    )

    db.session.add(note)
    db.session.commit()

    return jsonify(note.to_dict()), 201


@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """Update a note"""
    note = Note.query.get_or_404(note_id)
    data = request.json

    if 'content' in data:
        note.content = data['content']
    if 'note_type' in data:
        note.note_type = data['note_type']

    db.session.commit()
    return jsonify(note.to_dict())


@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Delete a note"""
    note = Note.query.get_or_404(note_id)
    db.session.delete(note)
    db.session.commit()
    return '', 204


# ==================== SCRAPING ====================

@app.route('/api/scrape/academic', methods=['POST'])
def scrape_academic():
    """Scrape academic sources for IMPLAN researchers"""
    data = request.json
    query = data.get('query', 'IMPLAN')
    max_results = data.get('max_results', 20)

    scraper = AcademicScraper()
    results = scraper.search_google_scholar(query, max_results)

    # Process results and create contacts/organizations
    created_count = 0
    for paper in results:
        if 'authors' in paper and paper['authors']:
            for author_name in paper['authors'][:3]:  # Limit to first 3 authors
                # Check if contact already exists
                existing = Contact.query.filter_by(full_name=author_name).first()
                if not existing:
                    contact = Contact(
                        full_name=author_name,
                        research_interests=f"Paper: {paper.get('title', '')}",
                        publications=paper.get('publication_info', ''),
                        status='Not Contacted'
                    )
                    db.session.add(contact)
                    created_count += 1

    db.session.commit()

    return jsonify({
        'success': True,
        'papers_found': len(results),
        'contacts_created': created_count,
        'message': f'Found {len(results)} papers and created {created_count} new contacts'
    })


@app.route('/api/scrape/business', methods=['POST'])
def scrape_business():
    """Scrape business sources for IMPLAN consultants"""
    data = request.json

    scraper = BusinessScraper()
    # Placeholder for actual business scraping
    results = []

    return jsonify({
        'success': True,
        'businesses_found': len(results),
        'message': 'Business scraping feature - configure search queries'
    })


# ==================== EXPORT ====================

@app.route('/api/export/google-sheets', methods=['POST'])
def export_to_google_sheets():
    """Export data to Google Sheets"""
    data = request.json
    export_type = data.get('type', 'organizations')

    try:
        if export_type == 'organizations':
            organizations = Organization.query.all()
            org_data = [org.to_dict() for org in organizations]
            spreadsheet_id = google_sheets.export_organizations(org_data)

        elif export_type == 'contacts':
            contacts = Contact.query.all()
            contact_data = []
            for contact in contacts:
                c_dict = contact.to_dict()
                # Add organization name
                if contact.organization:
                    c_dict['organization_name'] = contact.organization.name
                contact_data.append(c_dict)
            spreadsheet_id = google_sheets.export_contacts(contact_data)

        else:
            return jsonify({'error': 'Invalid export type'}), 400

        url = google_sheets.get_spreadsheet_url(spreadsheet_id)

        return jsonify({
            'success': True,
            'spreadsheet_id': spreadsheet_id,
            'url': url
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/export/hubspot', methods=['POST'])
def export_to_hubspot():
    """Export organization to HubSpot"""
    data = request.json
    org_id = data.get('organization_id')

    org = Organization.query.get_or_404(org_id)
    contacts = Contact.query.filter_by(organization_id=org_id).all()

    try:
        company_id, contact_ids = hubspot.sync_organization(
            org.to_dict(),
            [c.to_dict() for c in contacts]
        )

        # Update HubSpot IDs in database
        org.hubspot_id = company_id
        for contact, hs_id in zip(contacts, contact_ids):
            contact.hubspot_id = hs_id

        db.session.commit()

        return jsonify({
            'success': True,
            'company_id': company_id,
            'contact_ids': contact_ids
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ==================== STATS ====================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    total_orgs = Organization.query.count()
    total_contacts = Contact.query.count()

    orgs_by_status = db.session.query(
        Organization.status, db.func.count(Organization.id)
    ).group_by(Organization.status).all()

    contacts_by_status = db.session.query(
        Contact.status, db.func.count(Contact.id)
    ).group_by(Contact.status).all()

    return jsonify({
        'total_organizations': total_orgs,
        'total_contacts': total_contacts,
        'organizations_by_status': dict(orgs_by_status),
        'contacts_by_status': dict(contacts_by_status)
    })


if __name__ == '__main__':
    app.run(debug=True, port=6000)
