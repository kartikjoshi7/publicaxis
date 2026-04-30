"""
PublicAxis Backend — System Health Router
Provides readiness checks for Google Cloud Firestore and Vertex AI initialization status.
"""
from fastapi import APIRouter
from models import SystemStatus
from services.database_service import verify_connection as verify_db
from services.llm_service import is_initialized as ai_initialized

router = APIRouter(tags=["System Health"])


@router.get("/system-status", response_model=SystemStatus)
def system_status() -> SystemStatus:
    """
    Perform live readiness checks against Firestore and Vertex AI.
    Returns a structured status object for Cloud Run health probes.
    """
    db_status = "ok" if verify_db() else "failed"
    ai_status = "ok" if ai_initialized else "failed"

    return SystemStatus(
        status="ok" if db_status == "ok" and ai_status == "ok" else "degraded",
        database=db_status,
        ai_engine=ai_status
    )
