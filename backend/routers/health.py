from fastapi import APIRouter
from services.database_service import verify_connection as verify_db
from services.llm_service import is_initialized as ai_initialized

router = APIRouter()

@router.get("/system-status")
def system_status():
    db_status = "ok" if verify_db() else "failed"
    ai_status = "ok" if ai_initialized else "failed"
    
    return {
        "status": "ok" if db_status == "ok" and ai_status == "ok" else "degraded",
        "database": db_status,
        "ai_engine": ai_status
    }
