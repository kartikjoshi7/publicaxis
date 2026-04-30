/**
 * PublicAxis Frontend — API Response Interfaces
 * Strongly-typed contracts matching the backend Pydantic models.
 */

/** Response from the Omni-Civic Copilot chat endpoint. */
export interface ChatResponse {
  response: string;
}

/** Structured validation output from Gemini document analysis. */
export interface ValidationResult {
  missing_fields: string[];
  formatting_errors: string[];
  error?: string;
  raw_response?: string;
}

/** Response from the Form 6 Vision Validator endpoint. */
export interface FormValidationResponse {
  status: string;
  message: string;
  validation_result: ValidationResult;
}

/** GPS coordinates captured from the user's device. */
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

/** Response from the Civic Access Auditor infrastructure endpoint. */
export interface InfrastructureReport {
  issue_category: string;
  severity_score: number;
  repair_recommendation: string;
  location: GeoLocation;
}

/** Response from the Misinfo Sentinel fact-check endpoint. */
export interface FactCheckResult {
  risk_score: number;
  is_fake: boolean;
  extracted_claims: string[];
  fact_check_breakdown: string[];
}

/** Response from the KYC Radar candidate profile endpoint. */
export interface CandidateProfile {
  candidate_id: string;
  profile: string;
}

/** Chat message displayed in the Copilot UI. */
export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
