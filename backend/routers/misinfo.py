from fastapi import APIRouter, File, UploadFile, HTTPException
import json
from services.llm_service import analyze_misinformation

router = APIRouter(prefix="/api/fact-check", tags=["misinfo"])

@router.post("")
async def fact_check(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size must be under 10 MB.")
        result_json_str = analyze_misinformation(contents, file.content_type)
        return json.loads(result_json_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
