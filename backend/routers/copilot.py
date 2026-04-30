from fastapi import APIRouter
from pydantic import BaseModel, Field
from services.llm_service import generate_copilot_response
from services.knowledge_service import get_election_context

router = APIRouter(tags=["Omni-Civic Copilot"])

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=5000, description="Civic query text")
    language: str = Field(default="English", max_length=50, description="Response language")

class ChatResponse(BaseModel):
    response: str

@router.post("/api/chat", response_model=ChatResponse)
def copilot_chat(request: ChatRequest):
    # Retrieve relevant civic context based on user query
    civic_context = get_election_context(request.query)
    
    # Generate secured, grounded response
    ai_response = generate_copilot_response(
        user_query=request.query, 
        civic_context=civic_context,
        language=request.language
    )
    
    return ChatResponse(response=ai_response)
