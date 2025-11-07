import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import OrganizationDetail from './pages/OrganizationDetail';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Scraper from './pages/Scraper';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <h1>IMPLAN Lead Finder</h1>
            </Link>
            <ul className="nav-links">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/organizations">Organizations</Link></li>
              <li><Link to="/contacts">Contacts</Link></li>
              <li><Link to="/scraper">Find Leads</Link></li>
            </ul>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/:id" element={<OrganizationDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/scraper" element={<Scraper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
