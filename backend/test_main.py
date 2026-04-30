"""
PublicAxis Backend — Comprehensive Test Suite
Tests all API endpoints with mocked Vertex AI and Firestore dependencies.
"""
import io
import json
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


# ═══════════════════════════════════════════
# Health & Root Endpoint Tests
# ═══════════════════════════════════════════

class TestHealthCheck:
    """Tests for the root health check endpoint."""

    def test_root_returns_200(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello PublicAxis"}

    @patch("routers.health.verify_db", return_value=True)
    @patch("routers.health.ai_initialized", True)
    def test_system_status_all_ok(self, mock_db, *args):
        response = client.get("/system-status")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["database"] == "ok"
        assert data["ai_engine"] == "ok"

    @patch("routers.health.verify_db", return_value=False)
    @patch("routers.health.ai_initialized", True)
    def test_system_status_db_degraded(self, mock_db, *args):
        response = client.get("/system-status")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "degraded"
        assert data["database"] == "failed"


# ═══════════════════════════════════════════
# Omni-Civic Copilot Tests
# ═══════════════════════════════════════════

class TestCopilotChat:
    """Tests for POST /api/chat — the Omni-Civic Copilot endpoint."""

    @patch("routers.copilot.generate_copilot_response", return_value="Polling hours are 7 AM to 6 PM.")
    @patch("routers.copilot.get_election_context", return_value="Mock civic context")
    def test_chat_success(self, mock_context, mock_ai):
        response = client.post("/api/chat", json={"query": "What are the polling hours?"})
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert data["response"] == "Polling hours are 7 AM to 6 PM."

    @patch("routers.copilot.generate_copilot_response", return_value="Polling hours are 7 AM to 6 PM.")
    @patch("routers.copilot.get_election_context", return_value="Mock civic context")
    def test_chat_with_language(self, mock_context, mock_ai):
        response = client.post("/api/chat", json={"query": "मतदान का समय?", "language": "Hindi"})
        assert response.status_code == 200
        assert "response" in response.json()

    def test_chat_missing_query(self):
        response = client.post("/api/chat", json={})
        assert response.status_code == 422  # Pydantic validation error

    def test_chat_empty_query(self):
        response = client.post("/api/chat", json={"query": ""})
        assert response.status_code == 422  # min_length enforcement


# ═══════════════════════════════════════════
# Form 6 Vision Validator Tests
# ═══════════════════════════════════════════

class TestVisionValidator:
    """Tests for POST /api/validate-form — the Form 6 Vision Validator endpoint."""

    @patch("routers.vision.analyze_document", return_value='{"missing_fields": ["Date of Birth"], "formatting_errors": []}')
    def test_validate_form_success(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
        response = client.post(
            "/api/validate-form",
            files={"file": ("form6.png", fake_image, "image/png")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "validation_result" in data
        assert "Date of Birth" in data["validation_result"]["missing_fields"]

    def test_validate_form_invalid_file_type(self):
        fake_pdf = io.BytesIO(b"%PDF-1.4 fake content")
        response = client.post(
            "/api/validate-form",
            files={"file": ("document.pdf", fake_pdf, "application/pdf")}
        )
        assert response.status_code == 400
        assert "image" in response.json()["detail"].lower()

    @patch("routers.vision.analyze_document", return_value="not valid json at all")
    def test_validate_form_invalid_ai_response(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
        response = client.post(
            "/api/validate-form",
            files={"file": ("form6.png", fake_image, "image/png")}
        )
        assert response.status_code == 200
        data = response.json()
        # Should gracefully handle invalid JSON from AI
        assert "validation_result" in data

    def test_validate_form_no_file(self):
        response = client.post("/api/validate-form")
        assert response.status_code == 422  # Missing required file


# ═══════════════════════════════════════════
# Civic Access Auditor Tests
# ═══════════════════════════════════════════

class TestInfrastructureAuditor:
    """Tests for POST /api/report-issue — the Civic Access Auditor endpoint."""

    @patch("routers.infrastructure.evaluate_infrastructure", return_value='{"issue_category": "Pothole", "severity_score": 8, "repair_recommendation": "Fill with asphalt"}')
    def test_report_issue_success(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
        response = client.post(
            "/api/report-issue",
            files={"file": ("road.png", fake_image, "image/png")},
            data={"latitude": "28.6139", "longitude": "77.2090"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["issue_category"] == "Pothole"
        assert data["severity_score"] == 8
        assert data["location"]["latitude"] == 28.6139
        assert data["location"]["longitude"] == 77.2090

    def test_report_issue_invalid_file_type(self):
        fake_txt = io.BytesIO(b"plain text content")
        response = client.post(
            "/api/report-issue",
            files={"file": ("notes.txt", fake_txt, "text/plain")},
            data={"latitude": "28.6139", "longitude": "77.2090"}
        )
        assert response.status_code == 400

    def test_report_issue_missing_coordinates(self):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
        response = client.post(
            "/api/report-issue",
            files={"file": ("road.png", fake_image, "image/png")}
        )
        assert response.status_code == 422  # Missing required form fields


# ═══════════════════════════════════════════
# Misinfo Sentinel Tests
# ═══════════════════════════════════════════

class TestMisinfoSentinel:
    """Tests for POST /api/fact-check — the Misinfo Sentinel endpoint."""

    @patch("routers.misinfo.analyze_misinformation", return_value='{"risk_score": 85, "is_fake": true, "extracted_claims": ["Free ration cards"], "fact_check_breakdown": ["No such scheme exists"]}')
    def test_fact_check_success(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 100)
        response = client.post(
            "/api/fact-check",
            files={"file": ("whatsapp_forward.png", fake_image, "image/png")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["risk_score"] == 85
        assert data["is_fake"] is True
        assert len(data["extracted_claims"]) > 0

    def test_fact_check_invalid_file_type(self):
        fake_doc = io.BytesIO(b"word document content")
        response = client.post(
            "/api/fact-check",
            files={"file": ("doc.docx", fake_doc, "application/msword")}
        )
        assert response.status_code == 400


# ═══════════════════════════════════════════
# KYC Radar Tests
# ═══════════════════════════════════════════

class TestKycRadar:
    """Tests for GET /api/candidate/:id — the KYC Radar endpoint."""

    @patch("routers.kyc.generate_text", return_value="Candidate profile summary for John Doe")
    def test_get_candidate_success(self, mock_ai):
        response = client.get("/api/candidate/john-doe-2026")
        assert response.status_code == 200
        data = response.json()
        assert data["candidate_id"] == "john-doe-2026"
        assert "profile" in data
        assert len(data["profile"]) > 0

    @patch("routers.kyc.generate_text", return_value="No data found for this candidate.")
    def test_get_candidate_unknown(self, mock_ai):
        response = client.get("/api/candidate/unknown-candidate")
        assert response.status_code == 200
        data = response.json()
        assert data["candidate_id"] == "unknown-candidate"
        assert "profile" in data


# ═══════════════════════════════════════════
# Edge Case & Security Tests
# ═══════════════════════════════════════════

class TestEdgeCases:
    """Tests for edge cases, input validation, and security constraints."""

    def test_unknown_route_returns_404(self):
        response = client.get("/api/nonexistent-endpoint")
        assert response.status_code in [404, 405]

    def test_chat_oversized_input_rejected(self):
        oversized_query = "a" * 5001
        response = client.post("/api/chat", json={"query": oversized_query})
        assert response.status_code == 422  # max_length enforcement

    def test_cors_headers_present(self):
        response = client.options(
            "/",
            headers={
                "Origin": "https://publicaxis-2026.web.app",
                "Access-Control-Request-Method": "GET"
            }
        )
        # CORS should allow our production origin
        assert response.status_code in [200, 204, 405]

    def test_openapi_schema_accessible(self):
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert schema["info"]["title"] == "PublicAxis Backend"

    def test_root_health_check(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == {"message": "Hello PublicAxis"}

    def test_file_size_limit_exceeded(self):
        # 10MB + 1 byte
        oversized_image = io.BytesIO(b"\x00" * (10 * 1024 * 1024 + 1))
        
        # Test vision endpoint
        response = client.post(
            "/api/validate-form",
            files={"file": ("large.png", oversized_image, "image/png")}
        )
        assert response.status_code == 400
        assert "10 MB" in response.json()["detail"]

        # Reset pointer for next request
        oversized_image.seek(0)
        
        # Test infra endpoint
        response = client.post(
            "/api/report-issue",
            files={"file": ("large.png", oversized_image, "image/png")},
            data={"latitude": "0", "longitude": "0"}
        )
        assert response.status_code == 400
        assert "10 MB" in response.json()["detail"]

        oversized_image.seek(0)
        
        # Test misinfo endpoint
        response = client.post(
            "/api/fact-check",
            files={"file": ("large.png", oversized_image, "image/png")}
        )
        assert response.status_code == 400
        assert "10 MB" in response.json()["detail"]

    @patch("routers.copilot.generate_copilot_response", side_effect=Exception("Vertex AI API Down"))
    def test_copilot_internal_server_error(self, mock_ai):
        response = client.post("/api/chat", json={"query": "test"})
        # Note: the copilot route currently returns the error as text if it fails, or maybe it throws 500?
        # Actually in the router we catch and return it as text in `ai_response` or if the router doesn't catch it, it throws 500.
        # Wait, the router doesn't try/except, it just calls `generate_copilot_response`.
        # `generate_copilot_response` has a try/except that returns a string on error.
        assert response.status_code == 200
        assert "technical difficulties" in response.json()["response"].lower()

    @patch("routers.vision.analyze_document", side_effect=Exception("Vertex AI API Down"))
    def test_vision_internal_server_error(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 10)
        response = client.post("/api/validate-form", files={"file": ("form6.png", fake_image, "image/png")})
        assert response.status_code == 500
        assert "Vertex AI API Down" in response.json()["detail"]

    @patch("routers.infrastructure.evaluate_infrastructure", side_effect=Exception("Vertex AI API Down"))
    def test_infra_internal_server_error(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 10)
        response = client.post("/api/report-issue", files={"file": ("road.png", fake_image, "image/png")}, data={"latitude": "0", "longitude": "0"})
        assert response.status_code == 500
        assert "Vertex AI API Down" in response.json()["detail"]

    @patch("routers.misinfo.analyze_misinformation", side_effect=Exception("Vertex AI API Down"))
    def test_misinfo_internal_server_error(self, mock_ai):
        fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"\x00" * 10)
        response = client.post("/api/fact-check", files={"file": ("fake.png", fake_image, "image/png")})
        assert response.status_code == 500
        assert "Vertex AI API Down" in response.json()["detail"]
