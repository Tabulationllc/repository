import React, { useState, useEffect } from 'react';
import { getOrganizations, createOrganization, exportToGoogleSheets } from '../api';
import { Link } from 'react-router-dom';

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', type: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, [filter]);

  const loadOrganizations = async () => {
    try {
      const response = await getOrganizations(filter);
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportToGoogleSheets('organizations');
      if (response.data.success) {
        alert(`Exported to Google Sheets! URL: ${response.data.url}`);
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      alert('Error exporting: ' + (error.response?.data?.error || error.message));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading organizations...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Organizations</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export to Google Sheets'}
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Organization
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd6e2', borderRadius: '4px' }}
            >
              <option value="">All Statuses</option>
              <option value="Not Contacted">Not Contacted</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Type
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd6e2', borderRadius: '4px' }}
            >
              <option value="">All Types</option>
              <option value="Academic">Academic</option>
              <option value="Business">Business</option>
              <option value="Consulting">Consulting</option>
              <option value="Government">Government</option>
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="card">
        {organizations.length === 0 ? (
          <div className="empty-state">
            <h3>No organizations found</h3>
            <p>Start by finding leads or add organizations manually</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Contacts</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                <tr key={org.id} onClick={() => window.location.href = `/organizations/${org.id}`}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500, color: '#0091a7' }}>{org.name}</div>
                      {org.website && (
                        <div style={{ fontSize: '12px', color: '#516f90' }}>{org.website}</div>
                      )}
                    </div>
                  </td>
                  <td>{org.type}</td>
                  <td>{org.location}</td>
                  <td>
                    <span className={`badge badge-${getStatusClass(org.status)}`}>
                      {org.status}
                    </span>
                  </td>
                  <td>{org.priority}</td>
                  <td>{org.contacts?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Organization Modal */}
      {showAddModal && (
        <AddOrganizationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadOrganizations();
          }}
        />
      )}
    </div>
  );
}

function AddOrganizationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Business',
    website: '',
    location: '',
    description: '',
    status: 'Not Contacted',
    priority: 'Medium'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createOrganization(formData);
      onSuccess();
    } catch (error) {
      alert('Error creating organization: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px' }}>Add Organization</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
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
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default Organizations;
