import os
from google.oauth2.credentials import Credentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from typing import List, Dict

class GoogleSheetsExporter:
    """Export leads to Google Sheets"""

    def __init__(self, credentials_file=None):
        self.credentials_file = credentials_file or os.getenv('GOOGLE_SHEETS_CREDENTIALS_FILE')
        self.service = None
        if self.credentials_file and os.path.exists(self.credentials_file):
            self._initialize_service()

    def _initialize_service(self):
        """Initialize Google Sheets API service"""
        try:
            creds = service_account.Credentials.from_service_account_file(
                self.credentials_file,
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            self.service = build('sheets', 'v4', credentials=creds)
        except Exception as e:
            print(f"Error initializing Google Sheets service: {e}")
            self.service = None

    def create_spreadsheet(self, title="IMPLAN Leads"):
        """Create a new spreadsheet"""
        if not self.service:
            raise Exception("Google Sheets service not initialized. Check credentials file.")

        try:
            spreadsheet = {
                'properties': {
                    'title': title
                }
            }
            spreadsheet = self.service.spreadsheets().create(
                body=spreadsheet,
                fields='spreadsheetId'
            ).execute()

            return spreadsheet.get('spreadsheetId')
        except HttpError as error:
            print(f"An error occurred: {error}")
            return None

    def export_organizations(self, organizations: List[Dict], spreadsheet_id=None):
        """Export organizations to a Google Sheet"""
        if not self.service:
            raise Exception("Google Sheets service not initialized. Check credentials file.")

        # Create new spreadsheet if no ID provided
        if not spreadsheet_id:
            spreadsheet_id = self.create_spreadsheet("IMPLAN Leads - Organizations")

        # Prepare headers
        headers = [
            'ID', 'Name', 'Type', 'Website', 'Location', 'Industry',
            'Status', 'Priority', 'Source', 'Description', 'Created Date'
        ]

        # Prepare data rows
        rows = [headers]
        for org in organizations:
            row = [
                str(org.get('id', '')),
                org.get('name', ''),
                org.get('type', ''),
                org.get('website', ''),
                org.get('location', ''),
                org.get('industry', ''),
                org.get('status', ''),
                org.get('priority', ''),
                org.get('source', ''),
                org.get('description', ''),
                org.get('created_at', '')
            ]
            rows.append(row)

        # Write to sheet
        try:
            body = {
                'values': rows
            }
            result = self.service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range='Organizations!A1',
                valueInputOption='RAW',
                body=body
            ).execute()

            print(f"Updated {result.get('updatedCells')} cells.")
            return spreadsheet_id

        except HttpError as error:
            print(f"An error occurred: {error}")
            return None

    def export_contacts(self, contacts: List[Dict], spreadsheet_id=None):
        """Export contacts to a Google Sheet"""
        if not self.service:
            raise Exception("Google Sheets service not initialized. Check credentials file.")

        # Create new spreadsheet if no ID provided
        if not spreadsheet_id:
            spreadsheet_id = self.create_spreadsheet("IMPLAN Leads - Contacts")

        # Prepare headers
        headers = [
            'ID', 'Full Name', 'First Name', 'Last Name', 'Title',
            'Email', 'Phone', 'Organization', 'LinkedIn', 'Status',
            'Research Interests', 'Created Date'
        ]

        # Prepare data rows
        rows = [headers]
        for contact in contacts:
            row = [
                str(contact.get('id', '')),
                contact.get('full_name', ''),
                contact.get('first_name', ''),
                contact.get('last_name', ''),
                contact.get('title', ''),
                contact.get('email', ''),
                contact.get('phone', ''),
                contact.get('organization_name', ''),
                contact.get('linkedin_url', ''),
                contact.get('status', ''),
                contact.get('research_interests', ''),
                contact.get('created_at', '')
            ]
            rows.append(row)

        # Write to sheet
        try:
            body = {
                'values': rows
            }
            result = self.service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range='Contacts!A1',
                valueInputOption='RAW',
                body=body
            ).execute()

            print(f"Updated {result.get('updatedCells')} cells.")
            return spreadsheet_id

        except HttpError as error:
            print(f"An error occurred: {error}")
            return None

    def get_spreadsheet_url(self, spreadsheet_id):
        """Get the URL for a spreadsheet"""
        return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/edit"
