from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, copilot, vision, kyc, misinfo, infrastructure

app = FastAPI(title="PublicAxis Backend")

# Allow CORS for all origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(copilot.router)
app.include_router(vision.router)
app.include_router(kyc.router)
app.include_router(misinfo.router)
app.include_router(infrastructure.router)

@app.get("/")
def health_check():
    return {"message": "Hello PublicAxis"}
