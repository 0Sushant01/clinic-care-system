# Clinic Care System

A production-quality Clinic Management System built with Django, React, and Docker. Designed for therapists, receptionists, and administrators to manage patients, appointments, session notes, and clinical reports.

## Tech Stack & Architecture Highlights

| Layer | Technology | Key Highlights |
| --- | --- | --- |
| **Backend** | Python 3.12+, Django 6.0+, DRF | Split settings, versioned API (`/api/v1/`), structured logging |
| **Auth** | JWT in **HttpOnly Cookies** | Protection against XSS, automatic cookie rotation, CSRF integration |
| **Database** | SQLite (dev) / PostgreSQL (prod) | CustomUser with email login, UUID primary keys, Soft Delete, TimeStampedModel |
| **API Docs** | drf-spectacular (OpenAPI 3.0) | Interactive Swagger UI at `/api/docs/` and Schema at `/api/schema/` |
| **Frontend** | React, Vite, Tailwind CSS v4 | Functional components, Axios with credentials, cookie-based AuthContext |
| **Services** | Extensible service layer | AI Provider pattern (OpenRouter, Gemini, OpenAI), Audit logging, Prompts on disk |
| **Infra** | Docker, Docker Compose, Nginx | Multi-stage Dockerfiles, persistent volumes for DB and logs |

## Project Structure

```
clinic-care-system/
├── backend/                  # Django backend
│   ├── config/               # Settings package & root URLs
│   │   └── settings/         # Split settings (base, development, production, test)
│   ├── apps/                 # Modular Django apps
│   │   ├── users/            # CustomUser (email & UUID) + HttpOnly Cookie Auth
│   │   ├── patients/
│   │   ├── therapists/       # Therapist management
│   │   ├── appointments/
│   │   ├── notes/
│   │   ├── dashboard/
│   │   └── reports/
│   ├── common/               # Shared utilities
│   │   ├── models/           # BaseModel (UUID, TimeStampedModel, SoftDeleteModel)
│   │   ├── exceptions/       # Global DRF exception handler (consistent JSON errors)
│   │   ├── permissions/      # Role-based permissions (Admin, Receptionist, Therapist)
│   │   ├── pagination/       # StandardPagination (20 default, 100 max)
│   │   └── responses/        # Consistent API response helpers ({success, message, data/errors})
│   ├── services/             # Centralized business logic
│   │   ├── ai/               # AI Provider pattern & prompts (therapy_summary.txt, etc.)
│   │   ├── audit/            # Audit logging service
│   │   ├── notifications/
│   │   ├── emails/
│   │   ├── pdf/
│   │   └── storage/
│   ├── logs/                 # Application log files
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/         # Axios instance (withCredentials: true, CSRF header)
│   │   ├── contexts/         # AuthContext (cookie-based authentication)
│   │   └── routes/
│   └── vite.config.js
├── docker/                   # Docker configurations
├── docs/                     # Comprehensive architecture and API documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Quick Start

### 1. Local Development

#### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
cp ../.env.example ../.env      # Edit .env as needed

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser

python3 manage.py runserver
```

Backend API: `http://localhost:8000/api/v1/`
Swagger API Docs: `http://localhost:8000/api/docs/`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend Dev Server: `http://localhost:5173/`

### 2. Docker Setup

```bash
cp .env.example .env
docker compose up --build
```

Application URL: `http://localhost/`

## API Standards & Conventions

- **Versioned Routes**: All endpoints are prefixed with `/api/v1/`.
- **Response Format**:
  - Success: `{"success": true, "message": "...", "data": {...}}`
  - Error: `{"success": false, "message": "...", "errors": {...}}`
- **Cookie Authentication**: JWT access and refresh tokens are stored in `HttpOnly` cookies automatically managed by the backend.
- **Search & Ordering**: List endpoints support `?search=`, `?ordering=`, `?page=`, and `?page_size=`.

## Documentation

- [Architecture Guide](docs/architecture.md)
- [API Reference](docs/api.md)