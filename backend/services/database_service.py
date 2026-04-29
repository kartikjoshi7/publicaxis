import os
from google.cloud import firestore

# Initialize Firestore Client
try:
    db = firestore.Client()
except Exception as e:
    print(f"Failed to initialize Firestore: {e}")
    db = None

def verify_connection() -> bool:
    """
    Verify connection by writing and reading a dummy document to a system_health collection.
    """
    if db is None:
        return False
        
    try:
        doc_ref = db.collection("system_health").document("ping")
        doc_ref.set({"status": "ok", "timestamp": firestore.SERVER_TIMESTAMP})
        
        doc = doc_ref.get()
        if doc.exists:
            return True
        return False
    except Exception as e:
        print(f"Firestore connection verification failed: {e}")
        return False
