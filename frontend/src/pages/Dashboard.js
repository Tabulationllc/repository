import React, { useState, useEffect } from 'react';
import { getStats, getOrganizations, getContacts } from '../api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrgs, setRecentOrgs] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, orgsRes, contactsRes] = await Promise.all([
        getStats(),
        getOrganizations(),
        getContacts()
      ]);

      setStats(statsRes.data);
      setRecentOrgs(orgsRes.data.slice(0, 5));
      setRecentContacts(contactsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>Dashboard</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', color: '#ff7a59', marginBottom: '10px' }}>
            {stats?.total_organizations || 0}
          </h3>
          <p style={{ color: '#516f90' }}>Total Organizations</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', color: '#00a4bd', marginBottom: '10px' }}>
            {stats?.total_contacts || 0}
          </h3>
          <p style={{ color: '#516f90' }}>Total Contacts</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', color: '#7c98b6', marginBottom: '10px' }}>
            {stats?.organizations_by_status?.['Not Contacted'] || 0}
          </h3>
          <p style={{ color: '#516f90' }}>Not Contacted</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '36px', color: '#00a16b', marginBottom: '10px' }}>
            {stats?.organizations_by_status?.['Qualified'] || 0}
          </h3>
          <p style={{ color: '#516f90' }}>Qualified Leads</p>
        </div>
      </div>

      {/* Recent Organizations */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Organizations</h3>
          <Link to="/organizations" className="btn btn-secondary">View All</Link>
        </div>

        {recentOrgs.length === 0 ? (
          <div className="empty-state">
            <p>No organizations yet. Start by finding leads!</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrgs.map(org => (
                <tr key={org.id}>
                  <td>
                    <Link to={`/organizations/${org.id}`} style={{ color: '#0091a7', textDecoration: 'none', fontWeight: 500 }}>
                      {org.name}
                    </Link>
                  </td>
                  <td>{org.type}</td>
                  <td>{org.location}</td>
                  <td>
                    <span className={`badge badge-${getStatusClass(org.status)}`}>
                      {org.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Contacts */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Recent Contacts</h3>
          <Link to="/contacts" className="btn btn-secondary">View All</Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="empty-state">
            <p>No contacts yet. Start by finding leads!</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.map(contact => (
                <tr key={contact.id}>
                  <td>
                    <Link to={`/contacts/${contact.id}`} style={{ color: '#0091a7', textDecoration: 'none', fontWeight: 500 }}>
                      {contact.full_name || `${contact.first_name} ${contact.last_name}`}
                    </Link>
                  </td>
                  <td>{contact.title}</td>
                  <td>{contact.email}</td>
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

export default Dashboard;
