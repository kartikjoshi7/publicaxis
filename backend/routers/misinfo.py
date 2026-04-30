"""
PublicAxis Backend — Misinfo Sentinel Router
Uses Gemini 2.5 Flash to fact-check uploaded images of suspicious circulars or social media posts.
"""
import json
from fastapi import APIRouter, File, UploadFile, HTTPException
from models import FactCheckResult
from services.llm_service import analyze_misinformation

router = APIRouter(prefix="/api/fact-check", tags=["Misinfo Sentinel"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("", response_model=FactCheckResult)
async def fact_check(file: UploadFile = File(...)) -> FactCheckResult:
    """
    Analyze an uploaded image for misinformation.
    Extracts text and claims from the image, evaluates authenticity,
    and returns a structured fact-check verdict with risk scoring.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size must be under 10 MB.")

    try:
        result_json_str = analyze_misinformation(contents, file.content_type)
        result = json.loads(result_json_str)
        return FactCheckResult(**result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
