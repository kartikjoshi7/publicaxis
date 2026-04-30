"""
PublicAxis Backend — Form 6 Vision Validator Router
Uses Gemini 2.5 Flash multimodal vision to analyze voter registration documents.
"""
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from models import FormValidationResponse, ValidationResult
from services.llm_service import analyze_document

router = APIRouter(tags=["Form 6 Vision Validator"])

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/api/validate-form", response_model=FormValidationResponse)
async def validate_form(file: UploadFile = File(...)) -> FormValidationResponse:
    """
    Validate an uploaded Form 6 voter registration document.
    Accepts an image file, sends it to Gemini 2.5 Flash for multimodal analysis,
    and returns a structured report of missing fields and formatting errors.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size must be under 10 MB.")

    try:
        analysis_json_str = analyze_document(image_bytes=image_bytes, mime_type=file.content_type)

        try:
            analysis_result = json.loads(analysis_json_str)
        except json.JSONDecodeError:
            analysis_result = {
                "error": "Failed to parse AI response as JSON",
                "raw_response": analysis_json_str,
                "missing_fields": [],
                "formatting_errors": []
            }

        return FormValidationResponse(
            status="success",
            message=f"File '{file.filename}' processed successfully.",
            validation_result=ValidationResult(**analysis_result)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
