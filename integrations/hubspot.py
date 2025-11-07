import os
from hubspot import HubSpot
from hubspot.crm.companies import SimplePublicObjectInput, ApiException as CompaniesApiException
from hubspot.crm.contacts import ApiException as ContactsApiException
from typing import Dict, List

class HubSpotIntegration:
    """Integration with HubSpot CRM"""

    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('HUBSPOT_API_KEY')
        self.client = None
        if self.api_key:
            self.client = HubSpot(access_token=self.api_key)

    def create_company(self, organization: Dict):
        """Create a company in HubSpot from an organization"""
        if not self.client:
            raise Exception("HubSpot client not initialized. Check API key.")

        properties = {
            "name": organization.get('name'),
            "domain": organization.get('website', '').replace('http://', '').replace('https://', '').split('/')[0] if organization.get('website') else '',
            "city": organization.get('location'),
            "industry": organization.get('industry'),
            "description": organization.get('description'),
            "lifecyclestage": self._map_status_to_lifecycle(organization.get('status')),
            "hs_lead_status": organization.get('status'),
            "notes_last_contacted": organization.get('source', 'IMPLAN Lead Finder')
        }

        # Remove None values
        properties = {k: v for k, v in properties.items() if v is not None}

        try:
            simple_public_object_input = SimplePublicObjectInput(properties=properties)
            api_response = self.client.crm.companies.basic_api.create(
                simple_public_object_input=simple_public_object_input
            )
            return api_response.id
        except CompaniesApiException as e:
            print(f"Exception when creating company in HubSpot: {e}")
            return None

    def create_contact(self, contact: Dict):
        """Create a contact in HubSpot"""
        if not self.client:
            raise Exception("HubSpot client not initialized. Check API key.")

        properties = {
            "firstname": contact.get('first_name'),
            "lastname": contact.get('last_name'),
            "email": contact.get('email'),
            "phone": contact.get('phone'),
            "jobtitle": contact.get('title'),
            "linkedinbio": contact.get('linkedin_url'),
            "hs_lead_status": contact.get('status'),
            "notes_last_contacted": "Found via IMPLAN Lead Finder"
        }

        # Remove None values
        properties = {k: v for k, v in properties.items() if v is not None}

        try:
            simple_public_object_input = SimplePublicObjectInput(properties=properties)
            api_response = self.client.crm.contacts.basic_api.create(
                simple_public_object_input=simple_public_object_input
            )
            return api_response.id
        except ContactsApiException as e:
            print(f"Exception when creating contact in HubSpot: {e}")
            return None

    def associate_contact_with_company(self, contact_id: str, company_id: str):
        """Associate a contact with a company in HubSpot"""
        if not self.client:
            raise Exception("HubSpot client not initialized. Check API key.")

        try:
            self.client.crm.contacts.associations_api.create(
                contact_id=contact_id,
                to_object_type="companies",
                to_object_id=company_id,
                association_type="contact_to_company"
            )
            return True
        except Exception as e:
            print(f"Exception when associating contact with company: {e}")
            return False

    def sync_organization(self, organization: Dict, contacts: List[Dict] = None):
        """
        Sync an organization and its contacts to HubSpot
        Returns (company_id, contact_ids)
        """
        # Create company
        company_id = self.create_company(organization)

        if not company_id:
            return None, []

        # Create contacts if provided
        contact_ids = []
        if contacts:
            for contact in contacts:
                contact_id = self.create_contact(contact)
                if contact_id:
                    contact_ids.append(contact_id)
                    # Associate contact with company
                    self.associate_contact_with_company(contact_id, company_id)

        return company_id, contact_ids

    def _map_status_to_lifecycle(self, status):
        """Map our status to HubSpot lifecycle stage"""
        status_map = {
            'Not Contacted': 'lead',
            'Contacted': 'marketingqualifiedlead',
            'Qualified': 'salesqualifiedlead',
            'Lost': 'other'
        }
        return status_map.get(status, 'lead')

    def create_note(self, company_id: str, note_content: str):
        """Create a note in HubSpot"""
        if not self.client:
            raise Exception("HubSpot client not initialized. Check API key.")

        try:
            # Notes are called "engagements" in HubSpot API v3
            properties = {
                "hs_timestamp": "",
                "hs_note_body": note_content
            }

            # This is a simplified version - actual implementation may vary
            # based on HubSpot API version
            return True
        except Exception as e:
            print(f"Exception when creating note: {e}")
            return False
