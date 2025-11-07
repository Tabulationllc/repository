import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getNotes,
  createNote,
  exportToHubspot
} from '../api';

function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrg, setEditedOrg] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadOrganization();
    loadNotes();
  }, [id]);

  const loadOrganization = async () => {
    try {
      const response = await getOrganization(id);
      setOrganization(response.data);
      setEditedOrg(response.data);
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const response = await getNotes({ organization_id: id });
      setNotes(response.data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateOrganization(id, editedOrg);
      setOrganization(editedOrg);
      setIsEditing(false);
    } catch (error) {
      alert('Error updating organization: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization(id);
        navigate('/organizations');
      } catch (error) {
        alert('Error deleting organization: ' + error.message);
      }
    }
  };

  const handleSyncToHubSpot = async () => {
    setSyncing(true);
    try {
      const response = await exportToHubspot(id);
      if (response.data.success) {
        alert('Successfully synced to HubSpot!');
        loadOrganization(); // Reload to get HubSpot ID
      }
    } catch (error) {
      alert('Error syncing to HubSpot: ' + (error.response?.data?.error || error.message));
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading organization...</div>;
  }

  if (!organization) {
    return <div className="container">Organization not found</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '30px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/organizations')}>
          ← Back to Organizations
        </button>
      </div>

      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input
                type="text"
                value={editedOrg.name}
                onChange={(e) => setEditedOrg({ ...editedOrg, name: e.target.value })}
                style={{ fontSize: '28px', fontWeight: 600, width: '100%', padding: '5px' }}
              />
            ) : (
              <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{organization.name}</h1>
            )}

            {!isEditing && organization.website && (
              <a href={organization.website} target="_blank" rel="noopener noreferrer" style={{ color: '#0091a7' }}>
                {organization.website}
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing ? (
              <>
                <button className="btn btn-success" onClick={handleSyncToHubSpot} disabled={syncing}>
                  {syncing ? 'Syncing...' : organization.hubspot_id ? 'Re-sync to HubSpot' : 'Sync to HubSpot'}
                </button>
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
                  setEditedOrg(organization);
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

        {organization.hubspot_id && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#c2f0e4', borderRadius: '4px' }}>
            <small>✓ Synced with HubSpot (ID: {organization.hubspot_id})</small>
          </div>
        )}
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
                  <label>Type</label>
                  <select
                    value={editedOrg.type}
                    onChange={(e) => setEditedOrg({ ...editedOrg, type: e.target.value })}
                  >
                    <option value="Academic">Academic</option>
                    <option value="Business">Business</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Government">Government</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={editedOrg.website || ''}
                    onChange={(e) => setEditedOrg({ ...editedOrg, website: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editedOrg.location || ''}
                    onChange={(e) => setEditedOrg({ ...editedOrg, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={editedOrg.industry || ''}
                    onChange={(e) => setEditedOrg({ ...editedOrg, industry: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editedOrg.description || ''}
                    onChange={(e) => setEditedOrg({ ...editedOrg, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editedOrg.status}
                    onChange={(e) => setEditedOrg({ ...editedOrg, status: e.target.value })}
                  >
                    <option value="Not Contacted">Not Contacted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editedOrg.priority}
                    onChange={(e) => setEditedOrg({ ...editedOrg, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                <InfoRow label="Type" value={organization.type} />
                <InfoRow label="Location" value={organization.location} />
                <InfoRow label="Industry" value={organization.industry} />
                <InfoRow label="Description" value={organization.description} />
                <InfoRow label="Source" value={organization.source} />
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
                <span className={`badge badge-${getStatusClass(organization.status)}`}>
                  {organization.status}
                </span>
              </InfoRow>
              <InfoRow label="Priority" value={organization.priority} />
              <InfoRow label="Contacts" value={organization.contacts?.length || 0} />
            </div>
          </div>

          {/* Contacts */}
          {organization.contacts && organization.contacts.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {organization.contacts.map(contact => (
                  <div key={contact.id} style={{ paddingBottom: '15px', borderBottom: '1px solid #eaf0f6' }}>
                    <div style={{ fontWeight: 500, marginBottom: '5px' }}>{contact.full_name}</div>
                    {contact.title && <div style={{ fontSize: '13px', color: '#516f90', marginBottom: '5px' }}>{contact.title}</div>}
                    {contact.email && <div style={{ fontSize: '13px', color: '#0091a7' }}>{contact.email}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <AddNoteModal
          organizationId={id}
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

function AddNoteModal({ organizationId, onClose, onSuccess }) {
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
        organization_id: organizationId
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

export default OrganizationDetail;
