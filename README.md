# PublicAxis 🏛️

An enterprise-grade E-Governance platform designed to enhance citizen engagement, streamline document verification, and provide deep insights into political candidates.

## 🚀 Flagship Features

* **💬 Omni-Civic Copilot**: A secure, RAG-powered chat assistant that strictly answers citizen queries based on official Indian Election Commission rules. It is specifically guardrailed to decline non-election political debates.
* **👁️ Form 6 Vision Validator**: An automated AI document validator that processes uploaded Form 6 images, instantly identifying missing required fields and formatting errors using Gemini Vision.
* **📡 KYC Radar**: A real-time background scanning tool that generates structured, factual AI summaries of political candidates based on their ID.

## 🏗️ Architecture

* **Frontend**: Modern Angular Dashboard with a sleek, tab-based UI system (built for Firebase Hosting).
* **Backend**: High-performance FastAPI REST server.
* **Database & Storage**: Google Cloud Firestore and Cloud Storage.
* **AI Engine**: Google Cloud Vertex AI (Powered by the latest **Gemini 2.5 Flash**).

## 🛠️ Core Integrations

* `google-cloud-secret-manager`: Secure configuration and runtime secrets injection.
* `google-cloud-logging`: Structured operational logging tracing all AI interactions.
* `vertexai`: Direct, low-latency integration with Google's Generative Models.

## 🏃‍♂️ Getting Started Locally

### Backend
1. Navigate to the backend directory: `cd backend`
2. Activate the virtual environment: `.\venv\Scripts\activate`
3. Start the server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Access the dashboard at `http://localhost:4200`
