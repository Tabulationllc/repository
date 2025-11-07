import requests
from bs4 import BeautifulSoup
import time
import random
from typing import List, Dict
import re

class BaseScraper:
    """Base class for all scrapers"""

    def __init__(self, user_agent=None):
        self.user_agent = user_agent or 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': self.user_agent})

    def random_delay(self, min_seconds=1, max_seconds=3):
        """Add random delay to avoid rate limiting"""
        time.sleep(random.uniform(min_seconds, max_seconds))

    def get_page(self, url, params=None):
        """Fetch a page with error handling"""
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def extract_email(self, text):
        """Extract email from text"""
        if not text:
            return None
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None

    def extract_phone(self, text):
        """Extract phone number from text"""
        if not text:
            return None
        phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        matches = re.findall(phone_pattern, text)
        return matches[0] if matches else None

    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return None
        return ' '.join(text.split()).strip()
