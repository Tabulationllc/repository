import React, { useState, useEffect } from 'react';
import { getContacts, exportToGoogleSheets } from '../api';
import { Link } from 'react-router-dom';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '' });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [filter]);

  const loadContacts = async () => {
    try {
      const response = await getContacts(filter);
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await exportToGoogleSheets('contacts');
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
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Contacts</h2>
        <button className="btn btn-success" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export to Google Sheets'}
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ maxWidth: '300px' }}>
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
      </div>

      {/* Contacts Table */}
      <div className="card">
        {contacts.length === 0 ? (
          <div className="empty-state">
            <h3>No contacts found</h3>
            <p>Start by finding leads from academic sources</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Research Interests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} onClick={() => window.location.href = `/contacts/${contact.id}`}>
                  <td>
                    <div style={{ fontWeight: 500, color: '#0091a7' }}>
                      {contact.full_name || `${contact.first_name} ${contact.last_name}`}
                    </div>
                    {contact.linkedin_url && (
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer"
                         style={{ fontSize: '12px', color: '#516f90' }}
                         onClick={(e) => e.stopPropagation()}>
                        LinkedIn
                      </a>
                    )}
                  </td>
                  <td>{contact.title}</td>
                  <td>
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()} style={{ color: '#0091a7' }}>
                        {contact.email}
                      </a>
                    )}
                  </td>
                  <td>{contact.organization?.name || '—'}</td>
                  <td>
                    <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.research_interests || '—'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusClass(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default Contacts;
