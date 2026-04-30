# 🏛️ PublicAxis

> **Enterprise AI Platform for E-Governance, Civic Access & Document Intelligence**

![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

🚀 **Live Production Demo:** [https://publicaxis-2026.web.app](https://publicaxis-2026.web.app) (Hosted on Firebase)

⚙️ **API Backend:** [https://publicaxis-backend-23063176487.us-central1.run.app](https://publicaxis-backend-23063176487.us-central1.run.app) (Hosted on Google Cloud Run)

---

## 📖 Project Overview

India's civic infrastructure serves over **1.4 billion citizens**, yet the processes that underpin it — voter registration, document verification, infrastructure auditing — remain trapped in manual, opaque workflows.

**The reality on the ground:**
- 🕐 **Document verification delays** — Form 6 applications for voter registration are rejected due to minor formatting errors, with citizens discovering mistakes only after weeks-long postal cycles.
- ♿ **Inaccessible polling infrastructure** — Thousands of polling booths remain non-compliant with accessibility standards, with no scalable mechanism for citizens to report or audit deficiencies.
- 📢 **Civic misinformation** — During election cycles, fabricated circulars and manipulated government notices spread unchecked on WhatsApp and social media, eroding public trust in democratic institutions.

**PublicAxis** solves this by deploying an **AI-powered election education assistant** that helps citizens understand the **election process, timelines, and steps** in an interactive and easy-to-follow way. Powered by **Google Vertex AI (Gemini 2.5 Flash)** — a multimodal foundation model capable of processing text, images, and documents in a single inference call — the platform provides step-by-step voter registration guides, election day timelines, AI-driven document validation, and infrastructure auditing. Every interaction is designed for **mobile-first, low-connectivity environments** through a fully offline-capable **Progressive Web App** hosted on **Firebase Hosting** with the backend running serverlessly on **Google Cloud Run**.

---

## 🎯 Chosen Vertical: Election Process Education

PublicAxis is an **election education assistant** that helps users understand the election process, timelines, and steps in an interactive way — serving two distinct user personas:

### 👤 For Citizens
- **Step-by-Step Election Guides** via the Omni-Civic Copilot — ask any question about the election process and receive a structured, step-by-step response with timelines (e.g., "How do I register to vote?" → 6-step guide with 21-45 day processing timeline), powered by **Vertex AI**.
- **Offline Access** — critical voting FAQs and civic knowledge remain accessible even when internet connectivity drops, thanks to Service Worker caching in the **PWA**.
- **Form 6 Pre-Validation** — upload or photograph your voter registration form *before* submission and receive AI-driven feedback on missing fields, formatting errors, and compliance issues via **Gemini 2.5 Flash multimodal vision**.

### 🏛️ For Government Officials
- **Automated Infrastructure Auditing** — field officers capture images of polling stations using their device camera; **Gemini 2.5 Flash** evaluates accessibility compliance (ramps, signage, lighting) and generates structured audit reports with geo-tagged metadata.
- **Reduced Manual Verification** — AI-assisted document analysis eliminates the need for line-by-line manual review of voter registration forms, cutting processing times from days to seconds.

---

## 🏗️ System Architecture & Tech Stack

PublicAxis is engineered around a strict separation of concerns, operating across the **Google Cloud ecosystem** optimized for secure, scalable civic AI processing.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FIREBASE HOSTING (CDN)                        │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │              Angular 21 PWA  ·  Standalone Components        │   │
│   │                                                              │   │
│   │   ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐  │   │
│   │   │  Copilot     │ │  Vision     │ │  Infra Tracker       │  │   │
│   │   │  Chat UI     │ │  Validator  │ │  + Camera Capture    │  │   │
│   │   └─────────────┘ └─────────────┘ └──────────────────────┘  │   │
│   │   ┌─────────────┐ ┌──────────────────────────────────────┐  │   │
│   │   │  KYC Radar  │ │  Misinfo Sentinel                    │  │   │
│   │   └─────────────┘ └──────────────────────────────────────┘  │   │
│   │                                                              │   │
│   │              Service Workers  ·  Offline Cache               │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                              │  HTTPS                                │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   CORS Whitelist    │
                    │   (Origin-locked)   │
                    └──────────┬──────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                    GOOGLE CLOUD RUN (Dockerized)                     │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │           FastAPI Backend  ·  Python 3.10                    │   │
│   │                                                              │   │
│   │   /api/chat             → Omni-Civic Copilot                 │   │
│   │   /api/validate-form    → Form 6 Vision Validator            │   │
│   │   /api/report-issue     → Civic Access Auditor               │   │
│   │   /api/candidate/:id    → KYC Radar                          │   │
│   │   /api/fact-check       → Misinfo Sentinel                   │   │
│   │   /system-status        → Health Check (DB + AI readiness)   │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                    ┌─────────▼─────────┐                             │
│                    │  LLM Service      │                             │
│                    │  (Unified AI      │                             │
│                    │   Gateway)        │                             │
│                    └─────────┬─────────┘                             │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼─────────┐ ┌───────▼──────┐ ┌───────────▼────────────┐
│ Google Vertex AI   │ │ Google Cloud │ │ Google Cloud            │
│ Gemini 2.5 Flash   │ │ Firestore   │ │ Secret Manager          │
│ (Multimodal AI)    │ │ (NoSQL DB)  │ │ (Zero-Trust Secrets)    │
└───────────────────┘ └──────────────┘ └─────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Google Cloud        │
                    │ Logging             │
                    │ (Structured Logs)   │
                    └─────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **AI Engine** | Google Vertex AI (Gemini 2.5 Flash) | Multimodal foundation model — processes text, images, and documents via `vertexai.generative_models` SDK |
| **Frontend** | Angular 21, TypeScript | Standalone component architecture with Signals-based reactive state management |
| **UI Framework** | PWA (Service Workers) | Offline-first caching strategy; installable on mobile home screens |
| **Hosting** | Firebase Hosting | Global CDN with automatic SSL, SPA-aware rewrites |
| **Backend** | Python, FastAPI | High-performance async API with automatic OpenAPI schema generation |
| **Database** | Google Cloud Firestore | Serverless NoSQL document database for system health verification and civic data persistence |
| **Secrets** | Google Cloud Secret Manager | Zero-trust credential injection — `GEMINI_API_KEY` fetched at runtime via `SecretManagerServiceClient`, never committed to source |
| **Logging** | Google Cloud Logging | Structured production telemetry via `google.cloud.logging` SDK — all Vertex AI calls, errors, and latencies are traced |
| **Containerization** | Docker | Reproducible builds; `python:3.10-slim` base image for minimal attack surface |
| **Deployment** | Google Cloud Run | Serverless container execution with auto-scaling from 0 to N, dynamic `$PORT` binding |
| **Security** | CORS Middleware | Origin-locked whitelist — only `publicaxis-2026.web.app`, `publicaxis-2026.firebaseapp.com`, and `localhost:4200` are permitted |
| **Markdown Rendering** | ngx-markdown + marked | Renders AI responses as rich, formatted civic content in-browser |

- **Google Cloud Ecosystem**: Natively integrates **Google Vertex AI** for multimodal AI inference, **Google Cloud Secret Manager** for zero-trust credential injection, **Google Cloud Logging** for structured production telemetry, **Google Cloud Firestore** for serverless data persistence, and deployed via **Docker on Google Cloud Run** with frontend served through **Firebase Hosting**.

---

## ⚡ Core Features

### 🤖 Omni-Civic Copilot
An interactive election education assistant that helps citizens understand the **election process, timelines, and steps** in an easy-to-follow way. Ask any question — "How do I register to vote?", "What happens on election day?", "What are the phases of a general election?" — and receive a **structured, step-by-step guide** with timelines, pulled from a curated Election Commission knowledge corpus. Powered by **Google Vertex AI (Gemini 2.5 Flash)** with system-level prompt engineering. Supports **7 Indian languages** (English, Hindi, Gujarati, Tamil, Telugu, Marathi, Bengali) with localized voice input/output.

### 📄 Form 6 Vision Validator
Uses **Gemini 2.5 Flash's multimodal vision capabilities** via the Vertex AI SDK to scan uploaded or camera-captured voter registration forms (Form 6). The AI identifies missing fields, formatting inconsistencies, and compliance gaps — returning a structured JSON validation report (`missing_fields`, `formatting_errors`) with actionable remediation steps. Citizens catch errors *before* submission, not weeks after. Response format is enforced via `response_mime_type: "application/json"`.

### 🏗️ Civic Access Auditor
Leverages the mobile device's **native camera hardware** (via `<input type="file" capture>`) to photograph polling station infrastructure. **Gemini 2.5 Flash** evaluates the image against accessibility standards — ramps, signage, lighting, wheelchair access — and generates a geo-tagged audit report with `issue_category`, `severity_score`, and `repair_recommendation`, enriched with the device's GPS coordinates (`latitude`, `longitude`).

### 🛡️ Misinfo Sentinel
Upload a screenshot of a suspicious government circular, election notice, or social media claim. The AI performs a visual authenticity analysis — checking for font inconsistencies, logo manipulation, formatting anomalies — and returns a structured fact-check verdict with a `risk_score` (0–100), `is_fake` boolean, `extracted_claims`, and `fact_check_breakdown`.

### 🔍 KYC Radar
Lookup structured, AI-generated background profiles for political candidates. Returns an objective, factual summary of a candidate's public record to support informed civic participation. Powered by **Vertex AI** with role-specific system prompts.

### 📶 Offline PWA Support
Graceful degradation powered by **Service Workers**. When internet connectivity drops, the app continues to serve cached civic FAQs, voting guides, and previously loaded content. Users on low-bandwidth networks in rural polling areas can still access critical election information without interruption.

### 🔒 Security & Trust
- **Zero-Trust Architecture**: API keys and credentials managed exclusively through **Google Cloud Secret Manager** (`SecretManagerServiceClient`) — no secrets in source code or environment files in production.
- **CORS Allowlist**: Origins restricted to `publicaxis-2026.web.app`, `publicaxis-2026.firebaseapp.com`, and `localhost:4200` only.
- **Input Validation**: Pydantic models enforce `min_length`/`max_length` constraints on all user-submitted text fields (e.g., `query: str = Field(max_length=5000)`) to prevent injection and abuse.
- **File Size Limits**: All image upload endpoints enforce a **10 MB maximum** file size to prevent resource exhaustion on Cloud Run.
- **Structured Observability**: All AI inference calls, response latencies, and errors are logged to **Google Cloud Logging** with structured metadata for production debugging and audit trails.
- **System Health Monitoring**: The `/system-status` endpoint performs live readiness checks against both **Google Cloud Firestore** and **Vertex AI** initialization status — enabling Cloud Run health probes.

---

### ♿ Accessibility (WCAG 2.1 AA)
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>` elements throughout the application.
- **Skip-to-Content Link**: Keyboard-accessible skip link allows users to bypass navigation and jump directly to main content.
- **Keyboard Navigation**: Visible `:focus-visible` outlines (3px solid `#38bdf8`) on all interactive elements for keyboard users.
- **ARIA Support**: `aria-label` on all buttons and inputs, `aria-live="polite"` on the chat history for screen reader announcements of new messages.
- **Reduced Motion**: `prefers-reduced-motion` media query disables all animations and transitions for motion-sensitive users.
- **Multilingual Support**: 7 Indian languages supported (English, Hindi, Gujarati, Tamil, Telugu, Marathi, Bengali) with localized voice I/O.
- **Voice Input/Output**: Hands-free operation via Web Speech API (`SpeechRecognition`) and `SpeechSynthesis` for visually impaired or hands-occupied users.
- **Haptic Feedback**: `navigator.vibrate()` on key interactions for tactile confirmation on mobile devices.
- **Responsive Design**: Mobile-first layout with `safe-area-inset` support for notched devices.
- **PWA Installable**: `manifest.webmanifest` with `display: standalone` enables home screen installation for offline-first access.

---

## 🧪 Testing

The backend includes a comprehensive **PyTest** suite with **22 tests** across 7 test classes. All external dependencies (Vertex AI, Firestore) are mocked with `unittest.mock.patch` to ensure tests run without cloud credentials.

| Test Class | Tests | Coverage |
|-----------|-------|----------|
| `TestHealthCheck` | 3 | Root endpoint, system status OK, system status degraded |
| `TestCopilotChat` | 4 | Success, multilingual input, missing query, empty query rejection |
| `TestVisionValidator` | 4 | Success, invalid file type, invalid AI response fallback, missing file |
| `TestInfrastructureAuditor` | 3 | Success with GPS, invalid file type, missing coordinates |
| `TestMisinfoSentinel` | 2 | Success, invalid file type |
| `TestKycRadar` | 2 | Success, unknown candidate |
| `TestEdgeCases` | 4 | Unknown routes, oversized input, CORS headers, OpenAPI schema |

```bash
# Run the full test suite
cd backend
pip install -r requirements.txt
pytest test_main.py -v
```

---

## 💻 Local Setup & Installation

### Prerequisites

- **Python 3.10+** — Backend runtime
- **Node.js 20+** & **npm** — Frontend tooling
- **Google Cloud Project** — With Vertex AI API enabled
- **Gemini API Key** — Obtain from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/kartikjoshi7/publicaxis.git
cd publicaxis
```

### 2. Backend Initialization (FastAPI)

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
GOOGLE_CLOUD_PROJECT="your_gcp_project_id"
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The backend will be live at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive Swagger API documentation.

### 3. Frontend Initialization (Angular 21)

```bash
cd frontend
npm install
npm run start
```

Navigate to `http://localhost:4200` to access the PublicAxis platform.

### 4. Run Tests

```bash
cd backend
pytest test_main.py -v
```

---

## 🤔 Assumptions Made

| # | Assumption | Rationale |
|---|---|---|
| 1 | **Mobile-first usage in low-connectivity areas** | Indian election infrastructure extends to rural and semi-urban areas where internet is intermittent. The PWA architecture with Service Worker caching ensures critical civic information remains accessible offline. |
| 2 | **Hardware access (Camera) for infrastructure auditing** | Field officers and citizens use smartphones as their primary compute device. The Civic Access Auditor leverages the device's native camera and GPS to capture geo-tagged infrastructure evidence — no additional hardware required. |
| 3 | **Google Vertex AI as the sole AI engine** | A single multimodal model (Gemini 2.5 Flash via Vertex AI) handles text generation, document analysis, image understanding, and fact-checking — eliminating the complexity of managing multiple specialized models and reducing latency through unified inference. |
| 4 | **Google Cloud-native deployment** | All infrastructure runs on the Google Cloud ecosystem (Cloud Run, Firestore, Secret Manager, Cloud Logging, Firebase Hosting) for unified IAM, billing, and operational coherence. |

---

## 📂 Project Structure

```
publicaxis/
├── backend/
│   ├── main.py                  # FastAPI entry point, CORS config
│   ├── Dockerfile               # Google Cloud Run container definition
│   ├── requirements.txt         # Python dependencies (Vertex AI, Firestore, etc.)
│   ├── test_main.py             # Backend test suite
│   ├── routers/
│   │   ├── copilot.py           # /api/chat — Omni-Civic Copilot
│   │   ├── vision.py            # /api/validate-form — Form 6 Validator
│   │   ├── infrastructure.py    # /api/report-issue — Civic Access Auditor
│   │   ├── kyc.py               # /api/candidate/:id — KYC Radar
│   │   ├── misinfo.py           # /api/fact-check — Misinfo Sentinel
│   │   └── health.py            # /system-status — Health Check (Firestore + AI)
│   └── services/
│       ├── llm_service.py       # Vertex AI Gemini 2.5 Flash gateway + Cloud Logging
│       ├── knowledge_service.py # Embedded civic knowledge base (Election Commission rules)
│       ├── config_service.py    # Google Cloud Secret Manager integration
│       └── database_service.py  # Google Cloud Firestore client
│
├── frontend/
│   ├── src/app/
│   │   ├── app.ts               # Root component with tab navigation & SEO meta tags
│   │   ├── components/
│   │   │   ├── copilot-chat/    # AI chat interface
│   │   │   ├── vision-validator/# Document scan & validation UI
│   │   │   ├── infra-tracker/   # Camera capture & geo-tagged audit UI
│   │   │   ├── kyc-radar/       # Candidate lookup UI
│   │   │   └── misinfo-sentinel/# Fact-check upload UI
│   │   └── services/
│   │       └── api.ts           # Centralized HTTP client
│   └── package.json             # Angular 21 dependencies
│
├── firebase.json                # Firebase Hosting config (SPA rewrites)
├── .dockerignore                # Excludes node_modules, venv, .env from builds
└── README.md                    # ← You are here
```

---

## 🏆 Credits

This project was built for the **[Hack2Skill PromptWars Hackathon](https://hack2skill.com/)** — Election Process Education Vertical — by **[Kartik Joshi](https://github.com/kartikjoshi7)**.

---

<p align="center">
  <sub>Made with ❤️ for better governance · Powered by Google Vertex AI (Gemini 2.5 Flash)</sub>
</p>
