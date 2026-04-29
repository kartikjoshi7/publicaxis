from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import json
from services.llm_service import evaluate_infrastructure

router = APIRouter(prefix="/api/report-issue", tags=["infrastructure"])

@router.post("")
async def report_issue(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        contents = await file.read()
        result_json_str = evaluate_infrastructure(contents, file.content_type)
        result = json.loads(result_json_str)
        
        # Append coordinates to the final response
        result["location"] = {
            "latitude": latitude,
            "longitude": longitude
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
