"""
PublicAxis Backend — Main Application Entry Point
Configures FastAPI, CORS middleware, and registers all API routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, copilot, vision, kyc, misinfo, infrastructure

app = FastAPI(
    title="PublicAxis Backend",
    description="Enterprise AI Platform for Election Process Education — powered by Google Vertex AI (Gemini 2.5 Flash)",
    version="1.0.0",
)

# CORS middleware — origin-locked to production and local dev only
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",                 # Local Angular dev server
        "https://publicaxis-2026.web.app",       # Primary Firebase Hosting URL
        "https://publicaxis-2026.firebaseapp.com" # Alternative Firebase URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(health.router)
app.include_router(copilot.router)
app.include_router(vision.router)
app.include_router(kyc.router)
app.include_router(misinfo.router)
app.include_router(infrastructure.router)


@app.get("/")
def health_check() -> dict:
    """Root health check endpoint for Cloud Run readiness probes."""
    return {"message": "Hello PublicAxis"}
