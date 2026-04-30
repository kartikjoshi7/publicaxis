"""
PublicAxis Backend — KYC Radar Router
Provides AI-generated candidate background profiles via Vertex AI.
"""
from fastapi import APIRouter
from models import CandidateProfile
from services.llm_service import generate_text

router = APIRouter(tags=["KYC Radar"])


@router.get("/api/candidate/{candidate_id}", response_model=CandidateProfile)
def get_candidate_profile(candidate_id: str) -> CandidateProfile:
    """
    Retrieve an AI-generated background profile for a political candidate.
    Returns an objective, factual summary to support informed civic participation.
    """
    system_prompt = (
        "You are the KYC Radar system for PublicAxis. Your job is to provide a "
        "structured, objective, and factual summary of a political candidate's background."
    )
    user_prompt = f"Please provide a structured summary for candidate: {candidate_id}"

    ai_response = generate_text(system_prompt=system_prompt, user_prompt=user_prompt)

    return CandidateProfile(candidate_id=candidate_id, profile=ai_response)
