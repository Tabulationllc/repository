import React, { useState } from 'react';
import { scrapeAcademic } from '../api';

function Scraper() {
  const [activeTab, setActiveTab] = useState('academic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Academic scraper state
  const [academicForm, setAcademicForm] = useState({
    query: 'IMPLAN economic impact',
    max_results: 20
  });

  const handleAcademicSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await scrapeAcademic(academicForm);
      setResults(response.data);
    } catch (error) {
      alert('Error scraping: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '30px' }}>Find IMPLAN Leads</h2>

      <div className="card">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #eaf0f6', marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('academic')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'academic' ? '3px solid #ff7a59' : 'none',
              fontWeight: activeTab === 'academic' ? 600 : 400,
              color: activeTab === 'academic' ? '#33475b' : '#516f90'
            }}
          >
            Academic Research
          </button>
          <button
            onClick={() => setActiveTab('business')}
            style={{
              padding: '15px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === 'business' ? '3px solid #ff7a59' : 'none',
              fontWeight: activeTab === 'business' ? 600 : 400,
              color: activeTab === 'business' ? '#33475b' : '#516f90'
            }}
          >
            Business & Consulting
          </button>
        </div>

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Search Academic Publications</h3>
            <p style={{ color: '#516f90', marginBottom: '30px' }}>
              Search Google Scholar for academic papers mentioning IMPLAN. We'll extract author information
              and add them to your contacts.
            </p>

            <form onSubmit={handleAcademicSearch}>
              <div className="form-group">
                <label>Search Query</label>
                <input
                  type="text"
                  value={academicForm.query}
                  onChange={(e) => setAcademicForm({ ...academicForm, query: e.target.value })}
                  placeholder="e.g., IMPLAN economic impact"
                />
                <small style={{ color: '#516f90', marginTop: '5px', display: 'block' }}>
                  Try different combinations: "IMPLAN", "IMPLAN economic impact analysis", "IMPLAN regional economics"
                </small>
              </div>

              <div className="form-group">
                <label>Max Results</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={academicForm.max_results}
                  onChange={(e) => setAcademicForm({ ...academicForm, max_results: parseInt(e.target.value) })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : 'Search for Leads'}
              </button>
            </form>

            {results && (
              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#c2f0e4', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px', color: '#00783e' }}>✓ Search Complete</h4>
                <p style={{ color: '#00783e' }}>{results.message}</p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <a href="/contacts" className="btn btn-primary">
                    View Contacts
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Find IMPLAN Consultants & Businesses</h3>
            <p style={{ color: '#516f90', marginBottom: '30px' }}>
              Search for consulting firms, businesses, and organizations that offer IMPLAN services or use IMPLAN for economic impact analysis.
            </p>

            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f8fa', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '10px' }}>Coming Soon</h4>
              <p style={{ color: '#516f90' }}>
                This feature will search the web for businesses and consultants who use IMPLAN.
                <br />
                For now, you can manually add organizations from the Organizations page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>How It Works</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#ff7a59',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              1
            </div>
            <h4 style={{ marginBottom: '10px' }}>Search</h4>
            <p style={{ color: '#516f90', fontSize: '14px' }}>
              Enter search terms to find academic papers, businesses, or organizations that use IMPLAN
            </p>
          </div>

          <div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#00a4bd',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              2
            </div>
            <h4 style={{ marginBottom: '10px' }}>Extract</h4>
            <p style={{ color: '#516f90', fontSize: '14px' }}>
              We automatically extract contact information, research interests, and organization details
            </p>
          </div>

          <div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#00a16b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              marginBottom: '15px'
            }}>
              3
            </div>
            <h4 style={{ marginBottom: '10px' }}>Manage</h4>
            <p style={{ color: '#516f90', fontSize: '14px' }}>
              Track your outreach, add notes, and export to Google Sheets or sync with HubSpot
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h3 style={{ marginBottom: '20px' }}>Search Tips</h3>
        <ul style={{ color: '#516f90', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Use specific search terms: "IMPLAN" combined with "economic impact", "regional economics", "input-output analysis"</li>
          <li>Try location-specific searches: "IMPLAN California", "IMPLAN tourism analysis"</li>
          <li>Search for industries: "IMPLAN agriculture", "IMPLAN renewable energy"</li>
          <li>Academic papers often list author affiliations - great for finding university researchers</li>
          <li>Run multiple searches with different terms to find a broader range of potential customers</li>
        </ul>
      </div>
    </div>
  );
}

export default Scraper;
