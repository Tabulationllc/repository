from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Organization(db.Model):
    __tablename__ = 'organizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100))  # Academic, Business, Government, Consulting
    website = db.Column(db.String(500))
    description = db.Column(db.Text)
    location = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    size = db.Column(db.String(50))

    # CRM fields
    status = db.Column(db.String(50), default='Not Contacted')  # Not Contacted, Contacted, Qualified, Lost
    priority = db.Column(db.String(20), default='Medium')  # Low, Medium, High
    source = db.Column(db.String(100))  # Where we found them

    # HubSpot integration
    hubspot_id = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    contacts = db.relationship('Contact', backref='organization', lazy=True, cascade='all, delete-orphan')
    notes = db.relationship('Note', backref='organization', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'website': self.website,
            'description': self.description,
            'location': self.location,
            'industry': self.industry,
            'size': self.size,
            'status': self.status,
            'priority': self.priority,
            'source': self.source,
            'hubspot_id': self.hubspot_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'contacts': [c.to_dict() for c in self.contacts],
            'notes': [n.to_dict() for n in self.notes]
        }


class Contact(db.Model):
    __tablename__ = 'contacts'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)

    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    full_name = db.Column(db.String(255))
    title = db.Column(db.String(255))
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    linkedin_url = db.Column(db.String(500))

    # Research info
    research_interests = db.Column(db.Text)
    publications = db.Column(db.Text)
    google_scholar_url = db.Column(db.String(500))

    # CRM fields
    status = db.Column(db.String(50), default='Not Contacted')

    # HubSpot integration
    hubspot_id = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = db.relationship('Note', backref='contact', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'title': self.title,
            'email': self.email,
            'phone': self.phone,
            'linkedin_url': self.linkedin_url,
            'research_interests': self.research_interests,
            'publications': self.publications,
            'google_scholar_url': self.google_scholar_url,
            'status': self.status,
            'hubspot_id': self.hubspot_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=True)

    content = db.Column(db.Text, nullable=False)
    note_type = db.Column(db.String(50))  # Call, Email, Meeting, Research, Other

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'organization_id': self.organization_id,
            'contact_id': self.contact_id,
            'content': self.content,
            'note_type': self.note_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
