"""
PublicAxis Backend — Pydantic Models
Centralized request/response schemas for all API endpoints.
Enforces input validation and provides automatic OpenAPI documentation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


# ═══════════════════════════════════════════
# Omni-Civic Copilot Models
# ═══════════════════════════════════════════

class ChatRequest(BaseModel):
    """Request schema for the Omni-Civic Copilot chat endpoint."""
    query: str = Field(..., min_length=1, max_length=5000, description="Civic query text")
    language: str = Field(default="English", max_length=50, description="Response language")


class ChatResponse(BaseModel):
    """Response schema for the Omni-Civic Copilot chat endpoint."""
    response: str = Field(..., description="AI-generated civic guidance")


# ═══════════════════════════════════════════
# Form 6 Vision Validator Models
# ═══════════════════════════════════════════

class ValidationResult(BaseModel):
    """Structured validation output from Gemini document analysis."""
    missing_fields: List[str] = Field(default_factory=list, description="List of required fields not found in the document")
    formatting_errors: List[str] = Field(default_factory=list, description="List of formatting issues detected")
    error: Optional[str] = Field(default=None, description="Error message if analysis failed")
    raw_response: Optional[str] = Field(default=None, description="Raw AI response if JSON parsing failed")


class FormValidationResponse(BaseModel):
    """Response schema for the Form 6 Vision Validator endpoint."""
    status: str = Field(..., description="Processing status (success/error)")
    message: str = Field(..., description="Human-readable status message")
    validation_result: ValidationResult = Field(..., description="Structured validation output")


# ═══════════════════════════════════════════
# Civic Access Auditor Models
# ═══════════════════════════════════════════

class GeoLocation(BaseModel):
    """GPS coordinates captured from the user's device."""
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")


class InfrastructureReport(BaseModel):
    """Structured infrastructure audit output from Gemini vision analysis."""
    issue_category: str = Field(..., description="Type of infrastructure issue (e.g., Pothole, Broken Streetlight)")
    severity_score: int = Field(..., ge=1, le=10, description="Severity rating from 1 (minor) to 10 (critical)")
    repair_recommendation: str = Field(..., description="AI-generated repair guidance")
    location: Optional[GeoLocation] = Field(default=None, description="GPS coordinates of the reported issue")


# ═══════════════════════════════════════════
# Misinfo Sentinel Models
# ═══════════════════════════════════════════

class FactCheckResult(BaseModel):
    """Structured fact-check output from Gemini misinformation analysis."""
    risk_score: int = Field(..., ge=0, le=100, description="Misinformation risk score (0=safe, 100=highly fake)")
    is_fake: bool = Field(..., description="Whether the content is classified as misinformation")
    extracted_claims: List[str] = Field(default_factory=list, description="Claims extracted from the image")
    fact_check_breakdown: List[str] = Field(default_factory=list, description="Explanation of why each claim is true or false")


# ═══════════════════════════════════════════
# KYC Radar Models
# ═══════════════════════════════════════════

class CandidateProfile(BaseModel):
    """Response schema for the KYC Radar candidate lookup endpoint."""
    candidate_id: str = Field(..., description="Unique identifier for the candidate")
    profile: str = Field(..., description="AI-generated candidate background summary")


# ═══════════════════════════════════════════
# System Health Models
# ═══════════════════════════════════════════

class SystemStatus(BaseModel):
    """Response schema for the system health check endpoint."""
    status: str = Field(..., description="Overall system status (ok/degraded)")
    database: str = Field(..., description="Google Cloud Firestore connection status")
    ai_engine: str = Field(..., description="Vertex AI initialization status")
