import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContact, updateContact, deleteContact, getNotes, createNote } from '../api';

function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);

  useEffect(() => {
    loadContact();
    loadNotes();
  }, [id]);

  const loadContact = async () => {
    try {
      const response = await getContact(id);
      setContact(response.data);
      setEditedContact(response.data);
    } catch (error) {
      console.error('Error loading contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const response = await getNotes({ contact_id: id });
      setNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateContact(id, editedContact);
      setContact(editedContact);
      setIsEditing(false);
    } catch (error) {
      alert('Error updating contact: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        navigate('/contacts');
      } catch (error) {
        alert('Error deleting contact: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading contact...</div>;
  }

  if (!contact) {
    return <div className="container">Contact not found</div>;
  }

  const fullName = contact.full_name || `${contact.first_name} ${contact.last_name}`;

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/contacts')}>
          ← Back to Contacts
        </button>
      </div>

      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{fullName}</h1>
            {contact.title && <p style={{ color: '#516f90', marginBottom: '10px' }}>{contact.title}</p>}
            {contact.email && (
              <a href={`mailto:${contact.email}`} style={{ color: '#0091a7' }}>
                {contact.email}
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              <>
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
                <button className="btn btn-secondary" onClick={handleDelete}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => {
                  setIsEditing(false);
                  setEditedContact(contact);
                }}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          {/* Information */}
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Information</h3>

            {isEditing ? (
              <div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editedContact.first_name || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, first_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editedContact.last_name || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, last_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editedContact.title || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editedContact.email || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editedContact.phone || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={editedContact.linkedin_url || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, linkedin_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Research Interests</label>
                  <textarea
                    value={editedContact.research_interests || ''}
                    onChange={(e) => setEditedContact({ ...editedContact, research_interests: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editedContact.status}
                    onChange={(e) => setEditedContact({ ...editedContact, status: e.target.value })}
                  >
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                <InfoRow label="Phone" value={contact.phone} />
                <InfoRow label="LinkedIn">
                  {contact.linkedin_url ? (
                    <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0091a7' }}>
                      {contact.linkedin_url}
                    </a>
                  ) : '—'}
                </InfoRow>
                <InfoRow label="Research Interests" value={contact.research_interests} />
                <InfoRow label="Publications" value={contact.publications} />
                {contact.google_scholar_url && (
                  <InfoRow label="Google Scholar">
                    <a href={contact.google_scholar_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0091a7' }}>
                      View Profile
                    </a>
                  </InfoRow>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Notes & Activity</h3>
              <button className="btn btn-primary" onClick={() => setShowNoteModal(true)}>
                + Add Note
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet. Add notes to track your outreach!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {notes.map(note => (
                  <div key={note.id} style={{ padding: '15px', backgroundColor: '#f5f8fa', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="badge badge-info">{note.note_type}</span>
                      <span style={{ fontSize: '12px', color: '#516f90' }}>
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Details</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <InfoRow label="Status">
                <span className={`badge badge-${getStatusClass(contact.status)}`}>
                  {contact.status}
                </span>
              </InfoRow>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <AddNoteModal
          contactId={id}
          onClose={() => setShowNoteModal(false)}
          onSuccess={() => {
            setShowNoteModal(false);
            loadNotes();
          }}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#516f90', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontWeight: 500 }}>{children || value || '—'}</div>
    </div>
  );
}

function AddNoteModal({ contactId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    content: '',
    note_type: 'Other'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createNote({
        ...formData,
        contact_id: contactId
      });
      onSuccess();
    } catch (error) {
      alert('Error creating note: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px' }}>Add Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select value={formData.note_type} onChange={(e) => setFormData({ ...formData, note_type: e.target.value })}>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Research">Research</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Note *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your note here..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getStatusClass(status) {
  const statusMap = {
    'Not Contacted': 'secondary',
    'Contacted': 'info',
    'Qualified': 'success',
    'Lost': 'warning'
  };
  return statusMap[status] || 'secondary';
}

export default ContactDetail;
