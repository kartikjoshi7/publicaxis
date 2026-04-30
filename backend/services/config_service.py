"""
PublicAxis Backend — Google Cloud Secret Manager Configuration Service
Provides zero-trust credential injection with local .env fallback for development.
"""
import os
from dotenv import load_dotenv
from google.cloud import secretmanager

# Load local .env file if it exists
load_dotenv()

def get_secret(secret_id: str, project_id: str = None, version_id: str = "latest") -> str:
    """
    Fetch a secret from Google Cloud Secret Manager.
    Falls back to local environment variables if Secret Manager is not configured
    or the secret is not found.
    """
    # First check local environment
    local_val = os.getenv(secret_id)
    if local_val:
        return local_val
    
    if not project_id:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        
    if not project_id:
        return None
        
    try:
        client = secretmanager.SecretManagerServiceClient()
        name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
        response = client.access_secret_version(request={"name": name})
        payload = response.payload.data.decode("UTF-8")
        return payload
    except Exception as e:
        print(f"Error fetching secret {secret_id}: {e}")
        return None
