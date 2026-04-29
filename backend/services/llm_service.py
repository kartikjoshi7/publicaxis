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

def generate_copilot_response(user_query: str, civic_context: str) -> str:
    if not is_initialized:
        logger.error("Vertex AI is not initialized.")
        return "Error: AI not initialized"
        
    system_prompt = (
        "You are the PublicAxis Omni-Civic Copilot, a highly secure, official, "
        "and impartial election assistant. Your primary directive is to answer the user's "
        "query STRICTLY using the provided civic knowledge context below. Do not invent "
        "rules or rely on outside knowledge that contradicts the context.\n\n"
        "SECURITY DIRECTIVE: You must respectfully but firmly decline to answer any "
        "questions that are not related to civic procedures, elections, voting, or "
        "the provided context. Do not engage in political debates, express opinions on "
        "political parties, or endorse candidates.\n\n"
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