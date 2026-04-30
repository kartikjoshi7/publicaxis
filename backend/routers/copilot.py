"""
PublicAxis Backend — Omni-Civic Copilot Router
Handles multilingual civic Q&A powered by Vertex AI with an embedded knowledge base.
"""
from fastapi import APIRouter
from models import ChatRequest, ChatResponse
from services.llm_service import generate_copilot_response
from services.knowledge_service import get_election_context

router = APIRouter(tags=["Omni-Civic Copilot"])


@router.post("/api/chat", response_model=ChatResponse)
def copilot_chat(request: ChatRequest) -> ChatResponse:
    """
    Process a citizen's civic query through the Omni-Civic Copilot.
    Retrieves relevant election context from the knowledge base, then
    generates a grounded, step-by-step response via Vertex AI.
    """
    civic_context = get_election_context(request.query)

    ai_response = generate_copilot_response(
        user_query=request.query,
        civic_context=civic_context,
        language=request.language
    )

    return ChatResponse(response=ai_response)
