"""
PublicAxis Backend — Civic Access Auditor Router
Uses device camera + GPS + Gemini 2.5 Flash to generate geo-tagged infrastructure audit reports.
"""
import json
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from models import InfrastructureReport, GeoLocation
from services.llm_service import evaluate_infrastructure

router = APIRouter(prefix="/api/report-issue", tags=["Civic Access Auditor"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("", response_model=InfrastructureReport)
async def report_issue(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
) -> InfrastructureReport:
    """
    Analyze infrastructure from an uploaded image and GPS coordinates.
    The image is evaluated by Gemini 2.5 Flash for accessibility issues
    (ramps, signage, lighting) and a structured audit report is returned
    with the device's geo-tagged location.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size must be under 10 MB.")

    try:
        result_json_str = evaluate_infrastructure(contents, file.content_type)
        result = json.loads(result_json_str)

        return InfrastructureReport(
            issue_category=result.get("issue_category", "Unknown"),
            severity_score=result.get("severity_score", 0),
            repair_recommendation=result.get("repair_recommendation", "N/A"),
            location=GeoLocation(latitude=latitude, longitude=longitude)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
