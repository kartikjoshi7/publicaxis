"""
PublicAxis Backend — Google Vertex AI LLM Service
Centralized AI inference gateway using Gemini 2.5 Flash for text generation,
document analysis, infrastructure evaluation, and misinformation detection.
All calls are instrumented with Google Cloud Logging for production telemetry.
"""
import os
import logging
import google.cloud.logging
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from dotenv import load_dotenv

# Force load environment variables right away
load_dotenv()

# Initialize Google Cloud Logging
try:
    log_client = google.cloud.logging.Client()
    log_client.setup_logging()
    logger = logging.getLogger("vertex_ai_logger")
except Exception as e:
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("vertex_ai_logger")
    logger.warning(f"Google Cloud Logging not initialized (fallback to standard logging): {e}")

# Initialize Vertex AI with strict fallbacks to your actual GCP project
project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "publicaxis-2026")
location = os.getenv("VERTEX_AI_LOCATION", "us-central1")

try:
    vertexai.init(project=project_id, location=location)
    is_initialized = True
    logger.info(f"Vertex AI initialized successfully for project: {project_id}")
except Exception as e:
    print(f"🔥 INITIALIZATION ERROR: {str(e)}")
    logger.error(f"Failed to initialize Vertex AI: {e}")
    is_initialized = False

def generate_text(system_prompt: str, user_prompt: str) -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.", extra={"system_prompt": system_prompt, "user_prompt": user_prompt})
        return "Error: AI not initialized"
        
    try:
        model = GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=[system_prompt]
        )
        logger.info("Calling Vertex AI gemini-2.5-flash", extra={"system_prompt": system_prompt, "user_prompt": user_prompt})
        response = model.generate_content(user_prompt)
        logger.info("Successfully received response from Vertex AI", extra={"response_length": len(response.text) if response.text else 0})
        return response.text
    except Exception as e:
        print(f"🔥 TEXT GEN ERROR: {str(e)}")
        logger.error(f"Error calling Vertex AI: {e}", extra={"error": str(e)})
        return f"Error: {str(e)}"

def analyze_document(image_bytes: bytes, mime_type: str) -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.")
        return '{"error": "AI not initialized", "missing_fields": [], "formatting_errors": []}'
        
    system_prompt = (
        "You are an expert Indian Election Commission clerk reviewing a Form 6 "
        "voter registration document. Analyze the uploaded image and return a strict JSON "
        "object containing exactly two arrays: 'missing_fields' (list of strings for missing required fields) "
        "and 'formatting_errors' (list of strings for incorrectly formatted data)."
    )
    
    try:
        model = GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=[system_prompt]
        )
        
        part = Part.from_data(data=image_bytes, mime_type=mime_type)
        
        logger.info(f"Analyzing Form 6 document of type {mime_type}")
        
        response = model.generate_content(
            [part, "Analyze this Form 6 document and return the requested JSON."],
            generation_config={"response_mime_type": "application/json"}
        )
        
        logger.info("Successfully received analysis from Vertex AI")
        return response.text
    except Exception as e:
        print(f"🔥 VISION ERROR: {str(e)}")
        logger.error(f"Error calling Vertex AI for vision: {e}")
        return '{"error": "Failed to analyze document", "missing_fields": [], "formatting_errors": []}'

def generate_copilot_response(user_query: str, civic_context: str, language: str = "English") -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.")
        return "Error: AI not initialized"
        
    system_prompt = (
        "You are the PublicAxis Omni-Civic Copilot, an official election education assistant. "
        "Your primary goal is to help citizens understand the election process, timelines, and steps in an interactive and easy-to-follow way. "
        "When explaining election procedures, ALWAYS structure your response as clear, numbered step-by-step guides with timelines where applicable. "
        "Use markdown formatting (headers, bold, numbered lists) to make responses scannable and easy to follow. "
        "While you must prioritize the provided Civic Context for specific Indian Election rules and procedures, "
        "you ARE PERMITTED to use your internal knowledge to provide general, unbiased definitions of civic and electoral terms. "
        "Continue to strictly decline any political debates, opinions on political parties, or candidate endorsements.\n\n"
        f"CRITICAL MULTI-LINGUAL DIRECTIVE: You must respond in the language specified in the request: {language}. "
        "If no language is specified, use the language of the user query. Do not default to Hindi if the user is typing in English. "
        "When using the Civic Context, strictly pull facts without inventing rules.\n\n"
        f"CIVIC CONTEXT:\n{civic_context}"
    )
    
    try:
        model = GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=[system_prompt]
        )
        logger.info("Calling Vertex AI for copilot response")
        response = model.generate_content(user_query)
        logger.info("Successfully received copilot response")
        return response.text
    except Exception as e:
        print(f"🔥 COPILOT ERROR: {str(e)}")
        logger.error(f"Error calling Vertex AI for copilot: {e}")
        return "I apologize, but I am currently experiencing technical difficulties processing your request."

def analyze_misinformation(image_bytes: bytes, mime_type: str) -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.")
        return '{"error": "AI not initialized", "risk_score": 0, "is_fake": false, "extracted_claims": [], "fact_check_breakdown": []}'
        
    system_prompt = (
        "You are an expert fact-checker and misinformation analyst. "
        "Analyze the uploaded image (e.g., a WhatsApp forward or social media post). "
        "Extract the text and claims from the image, and determine if it is misinformation. "
        "Return a strict JSON object containing exactly: "
        "'risk_score' (number 0-100 where 100 is highly likely fake), "
        "'is_fake' (boolean), "
        "'extracted_claims' (list of strings representing the main claims), "
        "and 'fact_check_breakdown' (list of strings explaining why the claims are true or false)."
    )
    
    try:
        model = GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=[system_prompt]
        )
        
        part = Part.from_data(data=image_bytes, mime_type=mime_type)
        logger.info(f"Analyzing misinformation image of type {mime_type}")
        
        response = model.generate_content(
            [part, "Analyze this image for misinformation and return the requested JSON."],
            generation_config={"response_mime_type": "application/json"}
        )
        
        logger.info("Successfully received misinformation analysis from Vertex AI")
        return response.text
    except Exception as e:
        print(f"🔥 MISINFO ERROR: {str(e)}")
        logger.error(f"Error calling Vertex AI for misinformation analysis: {e}")
        return '{"error": "Failed to analyze document", "risk_score": 0, "is_fake": false, "extracted_claims": [], "fact_check_breakdown": []}'

def evaluate_infrastructure(image_bytes: bytes, mime_type: str) -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.")
        return '{"error": "AI not initialized", "issue_category": "Unknown", "severity_score": 0, "repair_recommendation": "None"}'
        
    system_prompt = (
        "You are an expert municipal engineer analyzing infrastructure issues. "
        "Analyze the uploaded image of broken infrastructure (e.g., potholes, broken streetlights). "
        "Return a strict JSON object containing exactly: "
        "'issue_category' (string, e.g., Pothole, Broken Streetlight, Water Leak), "
        "'severity_score' (number 1-10 where 10 is critically dangerous), "
        "and 'repair_recommendation' (string explaining how to fix it temporarily or permanently)."
    )
    
    try:
        model = GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=[system_prompt]
        )
        
        part = Part.from_data(data=image_bytes, mime_type=mime_type)
        logger.info(f"Analyzing infrastructure image of type {mime_type}")
        
        response = model.generate_content(
            [part, "Analyze this infrastructure issue and return the requested JSON."],
            generation_config={"response_mime_type": "application/json"}
        )
        
        logger.info("Successfully received infrastructure analysis from Vertex AI")
        return response.text
    except Exception as e:
        print(f"🔥 INFRASTRUCTURE ERROR: {str(e)}")
        logger.error(f"Error calling Vertex AI for infrastructure analysis: {e}")
        return '{"error": "Failed to analyze infrastructure", "issue_category": "Error", "severity_score": 0, "repair_recommendation": "Failed to process image"}'