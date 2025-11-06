import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Organizations
export const getOrganizations = (params) => api.get('/organizations', { params });
export const getOrganization = (id) => api.get(`/organizations/${id}`);
export const createOrganization = (data) => api.post('/organizations', data);
export const updateOrganization = (id, data) => api.put(`/organizations/${id}`, data);
export const deleteOrganization = (id) => api.delete(`/organizations/${id}`);

// Contacts
export const getContacts = (params) => api.get('/contacts', { params });
export const getContact = (id) => api.get(`/contacts/${id}`);
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

// Notes
export const getNotes = (params) => api.get('/notes', { params });
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Scraping
export const scrapeAcademic = (data) => api.post('/scrape/academic', data);
export const scrapeBusiness = (data) => api.post('/scrape/business', data);

// Export
export const exportToGoogleSheets = (type) => api.post('/export/google-sheets', { type });
export const exportToHubspot = (organizationId) =>
  api.post('/export/hubspot', { organization_id: organizationId });

// Stats
export const getStats = () => api.get('/stats');

export default api;
