import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.llm_service import analyze_document

router = APIRouter(tags=["Form 6 Vision Validator"])

@router.post("/api/validate-form")
async def validate_form(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
        
    try:
        image_bytes = await file.read()
        analysis_json_str = analyze_document(image_bytes=image_bytes, mime_type=file.content_type)
        
        try:
            analysis_result = json.loads(analysis_json_str)
        except json.JSONDecodeError:
            # Fallback if AI didn't return valid JSON
            analysis_result = {
                "error": "Failed to parse AI response as JSON",
                "raw_response": analysis_json_str,
                "missing_fields": [],
                "formatting_errors": []
            }
            
        return {
            "status": "success",
            "message": f"File '{file.filename}' processed successfully.",
            "validation_result": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
